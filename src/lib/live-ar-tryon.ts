import type { PoseLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

export type LiveArMode = "ar_garment" | "ar_cosplay" | "plain";
export type GarmentCropMode = "auto" | "top_only" | "full_set";

export interface NormalizedPoint {
  x: number;
  y: number;
  visibility: number;
}

export interface ExtractedGarmentAsset {
  heroUrl: string;
  fullCanvas: HTMLCanvasElement;
  topCanvas: HTMLCanvasElement;
  width: number;
  height: number;
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  shoulderWidth: number;
  torsoHeight: number;
  headCenter: { x: number; y: number; radiusX: number; radiusY: number };
  segmentationUsed: boolean;
}

export interface LiveRenderStats {
  poseDetected: boolean;
  confidence: number;
  bodyVisibility: "full" | "upper" | "none";
}

export interface LiveRenderOptions {
  garmentOpacity: number;
  manualScale: number;
  manualOffsetX: number;
  manualOffsetY: number;
  showTrackingGuide: boolean;
  timeMs: number;
}

// Landmark indices from MediaPipe BlazePose (33 keypoints)
const LM = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
} as const;

let videoLandmarkerPromise: Promise<PoseLandmarker | null> | null = null;
let imageLandmarkerPromise: Promise<PoseLandmarker | null> | null = null;
let reusableFaceCanvas: HTMLCanvasElement | null = null;
const garmentCache = new Map<string, ExtractedGarmentAsset>();

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / Math.max(1e-5, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Load MediaPipe PoseLandmarker in VIDEO mode (no segmentation masks for ~30 FPS fluidity).
 */
export async function getVideoPoseLandmarker(): Promise<PoseLandmarker | null> {
  if (typeof window === "undefined") return null;
  if (videoLandmarkerPromise) return videoLandmarkerPromise;

  videoLandmarkerPromise = (async () => {
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");

      try {
        return await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.45,
          minPosePresenceConfidence: 0.45,
          minTrackingConfidence: 0.45,
          outputSegmentationMasks: false,
        });
      } catch {
        // Fallback smoothly to CPU delegate if WebGL delegate fails on certain mobile WebViews
        return await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/pose_landmarker_lite.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.45,
          minPosePresenceConfidence: 0.45,
          minTrackingConfidence: 0.45,
          outputSegmentationMasks: false,
        });
      }
    } catch (err) {
      console.warn("PoseLandmarker VIDEO init failed:", err);
      videoLandmarkerPromise = null;
      return null;
    }
  })();

  return videoLandmarkerPromise;
}

/**
 * Load MediaPipe PoseLandmarker in IMAGE mode with foreground segmentation mask enabled.
 * Used once per look to cleanly isolate clothing from editorial studio backgrounds.
 */
async function getImagePoseLandmarker(): Promise<PoseLandmarker | null> {
  if (typeof window === "undefined") return null;
  if (imageLandmarkerPromise) return imageLandmarkerPromise;

  imageLandmarkerPromise = (async () => {
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");

      try {
        return await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numPoses: 1,
          minPoseDetectionConfidence: 0.35,
          outputSegmentationMasks: true,
        });
      } catch {
        return await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/pose_landmarker_lite.task",
            delegate: "CPU",
          },
          runningMode: "IMAGE",
          numPoses: 1,
          minPoseDetectionConfidence: 0.35,
          outputSegmentationMasks: true,
        });
      }
    } catch (err) {
      console.warn("PoseLandmarker IMAGE init failed:", err);
      imageLandmarkerPromise = null;
      return null;
    }
  })();

  return imageLandmarkerPromise;
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (/^https?:\/\//i.test(src) && typeof window !== "undefined") {
      try {
        const parsed = new URL(src, window.location.origin);
        if (parsed.origin !== window.location.origin) {
          img.crossOrigin = "anonymous";
        }
      } catch {
        // Ignore URL parsing issue
      }
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function sampleFloatMaskBilinear(
  data: Float32Array,
  mw: number,
  mh: number,
  nx: number,
  ny: number
): number {
  const gx = clamp(nx, 0, 1) * (mw - 1);
  const gy = clamp(ny, 0, 1) * (mh - 1);
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const x1 = Math.min(mw - 1, x0 + 1);
  const y1 = Math.min(mh - 1, y0 + 1);
  const fx = gx - x0;
  const fy = gy - y0;

  const v00 = data[y0 * mw + x0] ?? 0;
  const v10 = data[y0 * mw + x1] ?? 0;
  const v01 = data[y1 * mw + x0] ?? 0;
  const v11 = data[y1 * mw + x1] ?? 0;

  const top = v00 * (1 - fx) + v10 * fx;
  const bot = v01 * (1 - fx) + v11 * fx;
  return top * (1 - fy) + bot * fy;
}

/**
 * Extract background-removed full outfit & top-only sprites + exact shoulder/head landmarks
 * from any Look.u look photo (`heroImageUrl`). Cached automatically per URL.
 */
export async function extractGarmentSprites(
  heroImageUrl: string
): Promise<ExtractedGarmentAsset | null> {
  if (typeof window === "undefined" || !heroImageUrl) return null;

  const cached = garmentCache.get(heroImageUrl);
  if (cached) return cached;

  try {
    const img = await loadImageElement(heroImageUrl);
    const maxW = 520;
    const scale = Math.min(1, maxW / Math.max(1, img.width));
    const w = Math.max(120, Math.round(img.width * scale));
    const h = Math.max(150, Math.round(img.height * scale));

    const baseCanvas = document.createElement("canvas");
    baseCanvas.width = w;
    baseCanvas.height = h;
    const bCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    if (!bCtx) return null;
    bCtx.drawImage(img, 0, 0, w, h);

    // Default anatomical estimates for editorial studio framing (fallback if detection fails)
    let leftShoulder = { x: w * 0.37, y: h * 0.275 };
    let rightShoulder = { x: w * 0.63, y: h * 0.275 };
    let hipMidY = h * 0.56;
    let bottomHemY = h * 0.92;
    let headCenter = {
      x: w * 0.5,
      y: h * 0.175,
      radiusX: w * 0.085,
      radiusY: h * 0.1,
    };

    let maskArr: Float32Array | null = null;
    let maskW = 0;
    let maskH = 0;
    let segmentationUsed = false;

    const imageLandmarker = await getImagePoseLandmarker();
    if (imageLandmarker) {
      try {
        const result = imageLandmarker.detect(baseCanvas);
        const lms = result.landmarks?.[0];
        if (lms && lms.length >= 25) {
          const s11 = { x: lms[LM.LEFT_SHOULDER].x * w, y: lms[LM.LEFT_SHOULDER].y * h };
          const s12 = { x: lms[LM.RIGHT_SHOULDER].x * w, y: lms[LM.RIGHT_SHOULDER].y * h };
          // Keep visual left <= visual right regardless of subject facing direction
          if (s11.x <= s12.x) {
            leftShoulder = s11;
            rightShoulder = s12;
          } else {
            leftShoulder = s12;
            rightShoulder = s11;
          }

          const h23 = lms[LM.LEFT_HIP].y * h;
          const h24 = lms[LM.RIGHT_HIP].y * h;
          hipMidY = (h23 + h24) / 2;

          const kneeY =
            lms[LM.LEFT_KNEE] && lms[LM.RIGHT_KNEE]
              ? ((lms[LM.LEFT_KNEE].y + lms[LM.RIGHT_KNEE].y) / 2) * h
              : hipMidY + (hipMidY - (leftShoulder.y + rightShoulder.y) / 2) * 1.15;
          bottomHemY = clamp(
            Math.max(kneeY + (kneeY - hipMidY) * 0.72, h * 0.72),
            hipMidY + 40,
            h * 0.96
          );

          const nose = lms[LM.NOSE];
          const earL = lms[LM.LEFT_EAR];
          const earR = lms[LM.RIGHT_EAR];
          const shoulderWidthPx = Math.hypot(
            rightShoulder.x - leftShoulder.x,
            rightShoulder.y - leftShoulder.y
          );
          const earSpanPx =
            earL && earR ? Math.abs(earL.x - earR.x) * w : shoulderWidthPx * 0.42;

          const hx = nose ? nose.x * w : (leftShoulder.x + rightShoulder.x) / 2;
          const hy = nose
            ? nose.y * h - shoulderWidthPx * 0.04
            : (leftShoulder.y + rightShoulder.y) / 2 - shoulderWidthPx * 0.42;

          headCenter = {
            x: hx,
            y: hy,
            radiusX: Math.max(shoulderWidthPx * 0.34, earSpanPx * 0.88),
            radiusY: Math.max(shoulderWidthPx * 0.42, earSpanPx * 1.12),
          };
        }

        const segMask = result.segmentationMasks?.[0];
        if (segMask) {
          const rawFloat = segMask.getAsFloat32Array();
          maskArr = new Float32Array(rawFloat);
          maskW = segMask.width;
          maskH = segMask.height;
          segmentationUsed = true;
        }
        result.close();
      } catch (err) {
        console.warn("Hero pose/segmentation fallback triggered:", err);
      }
    }

    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const shoulderWidth = Math.max(
      40,
      Math.hypot(rightShoulder.x - leftShoulder.x, rightShoulder.y - leftShoulder.y)
    );
    const torsoHeight = Math.max(50, hipMidY - shoulderMidY);

    // Build two clean transparent garment sprites:
    // 1. fullCanvas: full outfit from collar scoop down to hem
    // 2. topCanvas: upper body garment from collar scoop down past hip waist line
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = w;
    fullCanvas.height = h;
    const fCtx = fullCanvas.getContext("2d");

    const topCanvas = document.createElement("canvas");
    topCanvas.width = w;
    topCanvas.height = h;
    const tCtx = topCanvas.getContext("2d");

    if (!fCtx || !tCtx) return null;

    const srcImageData = bCtx.getImageData(0, 0, w, h);
    const fullData = new ImageData(new Uint8ClampedArray(srcImageData.data), w, h);
    const topData = new ImageData(new Uint8ClampedArray(srcImageData.data), w, h);

    // Bottom threshold for top-only crop (slightly below hip bone for natural untucked/tucked blouse)
    const topHemY = clamp(hipMidY + torsoHeight * 0.36, shoulderMidY + 60, h * 0.92);

    for (let y = 0; y < h; y++) {
      const ny = y / h;
      for (let x = 0; x < w; x++) {
        const nx = x / w;
        const idx = (y * w + x) * 4;

        // 1. Foreground person alpha from MediaPipe Pose Segmentation (or fallback silhouette cone)
        let personAlpha = 1;
        if (maskArr && maskW > 0 && maskH > 0) {
          const prob = sampleFloatMaskBilinear(maskArr, maskW, maskH, nx, ny);
          personAlpha = smoothstep(0.38, 0.72, prob);
        } else {
          // Soft torso box fallback if mask failed
          const halfSpan = shoulderWidth * 0.92;
          const dxDist = Math.abs(x - shoulderMidX);
          personAlpha = 1 - smoothstep(halfSpan * 0.78, halfSpan * 1.15, dxDist);
        }

        // 2. Collar & Neck U-Scoop cutout (removes model's head/face/neck cleanly above collarbone)
        const dxNorm = Math.abs(x - shoulderMidX) / (shoulderWidth * 0.5);
        // At center chest/neck (dxNorm < 0.34), scoop slightly deeper below collarbone;
        // Across shoulders (0.34..1.0), stay right along shoulder seam top
        const neckDepth =
          dxNorm < 0.42
            ? shoulderWidth * 0.06 * Math.cos((dxNorm / 0.42) * (Math.PI / 2))
            : -shoulderWidth * 0.16 * smoothstep(0.42, 0.85, dxNorm);
        const collarCutoffY = shoulderMidY + neckDepth;
        const topNeckAlpha = smoothstep(collarCutoffY - 8, collarCutoffY + 14, y);

        // 3. Soft horizontal sleeve reach guard (trims stray hand fingertips / bags far outside sleeves)
        const sleeveLimit = shoulderWidth * 1.12;
        const sleeveAlpha = 1 - smoothstep(sleeveLimit * 0.86, sleeveLimit * 1.18, Math.abs(x - shoulderMidX));

        // 4. Full Outfit bottom trim (fades gently at shoes/ankles)
        const fullBottomAlpha = 1 - smoothstep(bottomHemY - 28, bottomHemY + 12, y);

        // 5. Top-only waist hem trim (fades gently below hip line)
        const topBottomAlpha = 1 - smoothstep(topHemY - 34, topHemY + 8, y);

        const alphaFull = clamp(personAlpha * topNeckAlpha * sleeveAlpha * fullBottomAlpha, 0, 1);
        const alphaTop = clamp(personAlpha * topNeckAlpha * sleeveAlpha * topBottomAlpha, 0, 1);

        fullData.data[idx + 3] = Math.round(fullData.data[idx + 3] * alphaFull);
        topData.data[idx + 3] = Math.round(topData.data[idx + 3] * alphaTop);
      }
    }

    fCtx.putImageData(fullData, 0, 0);
    tCtx.putImageData(topData, 0, 0);

    const asset: ExtractedGarmentAsset = {
      heroUrl: heroImageUrl,
      fullCanvas,
      topCanvas,
      width: w,
      height: h,
      leftShoulder,
      rightShoulder,
      shoulderWidth,
      torsoHeight,
      headCenter,
      segmentationUsed,
    };

    if (garmentCache.size > 6) {
      const oldestKey = garmentCache.keys().next().value;
      if (oldestKey) garmentCache.delete(oldestKey);
    }
    garmentCache.set(heroImageUrl, asset);

    return asset;
  } catch (err) {
    console.warn("extractGarmentSprites failed:", err);
    return null;
  }
}

/**
 * Compute object-cover crop mapping from raw video dimensions into target WxH canvas.
 */
export function getVideoCoverCrop(
  vw: number,
  vh: number,
  targetW: number,
  targetH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const targetRatio = targetW / targetH;
  const videoRatio = vw / Math.max(1, vh);
  let sx = 0;
  let sy = 0;
  let sw = vw;
  let sh = vh;

  if (videoRatio > targetRatio) {
    sw = vh * targetRatio;
    sx = (vw - sw) / 2;
  } else {
    sh = vw / targetRatio;
    sy = (vh - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

function mapRawLandmarkToCanvas(
  lm: NormalizedLandmark,
  crop: { sx: number; sy: number; sw: number; sh: number },
  vw: number,
  vh: number,
  canvasW: number,
  canvasH: number,
  mirrored: boolean
): NormalizedPoint {
  const vx = lm.x * vw;
  const vy = lm.y * vh;
  const cxNorm = (vx - crop.sx) / Math.max(1, crop.sw);
  const cyNorm = (vy - crop.sy) / Math.max(1, crop.sh);
  return {
    x: (mirrored ? 1 - cxNorm : cxNorm) * canvasW,
    y: cyNorm * canvasH,
    visibility: lm.visibility ?? 0.9,
  };
}

function getSmoothedPoint(
  index: number,
  raw: NormalizedPoint,
  buffer: Record<number, NormalizedPoint>,
  alpha = 0.34
): NormalizedPoint {
  const prev = buffer[index];
  if (!prev) {
    buffer[index] = raw;
    return raw;
  }
  // If large jump (>18% of frame), snap faster; otherwise apply smooth EMA
  const dist = Math.hypot(raw.x - prev.x, raw.y - prev.y);
  const effAlpha = dist > 110 ? 0.65 : alpha;
  const next: NormalizedPoint = {
    x: prev.x + (raw.x - prev.x) * effAlpha,
    y: prev.y + (raw.y - prev.y) * effAlpha,
    visibility: prev.visibility + (raw.visibility - prev.visibility) * 0.4,
  };
  buffer[index] = next;
  return next;
}

/**
 * Render one real-time frame on the Live AR canvas at up to 30+ FPS.
 */
export function renderLiveArVideoFrame(params: {
  ctx: CanvasRenderingContext2D;
  canvasW: number;
  canvasH: number;
  video: HTMLVideoElement;
  mirrored: boolean;
  mode: LiveArMode;
  cropMode: GarmentCropMode;
  garmentAsset: ExtractedGarmentAsset | null;
  heroImageEl: HTMLImageElement | null;
  rawLandmarks: NormalizedLandmark[] | null;
  smoothBuffer: Record<number, NormalizedPoint>;
  options: LiveRenderOptions;
}): LiveRenderStats {
  const {
    ctx,
    canvasW,
    canvasH,
    video,
    mirrored,
    mode,
    cropMode,
    garmentAsset,
    heroImageEl,
    rawLandmarks,
    smoothBuffer,
    options,
  } = params;

  const vw = video.videoWidth || 720;
  const vh = video.videoHeight || 900;
  const crop = getVideoCoverCrop(vw, vh, canvasW, canvasH);

  ctx.clearRect(0, 0, canvasW, canvasH);

  // Draw live mirrored/unmirrored video feed as base for "ar_garment" and "plain"
  if (mode !== "ar_cosplay") {
    ctx.save();
    if (mirrored) {
      ctx.translate(canvasW, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvasW, canvasH);
    ctx.restore();
  }

  // Extract and smooth tracked anatomical landmarks
  const keyIndices = [
    LM.NOSE,
    LM.LEFT_EYE,
    LM.RIGHT_EYE,
    LM.LEFT_EAR,
    LM.RIGHT_EAR,
    LM.LEFT_SHOULDER,
    LM.RIGHT_SHOULDER,
    LM.LEFT_ELBOW,
    LM.RIGHT_ELBOW,
    LM.LEFT_HIP,
    LM.RIGHT_HIP,
  ];

  const tracked: Partial<Record<number, NormalizedPoint>> = {};
  let hasConfidentUpperPose = false;
  let avgConfidence = 0;

  if (rawLandmarks && rawLandmarks.length >= 25) {
    for (const idx of keyIndices) {
      const lm = rawLandmarks[idx];
      if (!lm) continue;
      const mapped = mapRawLandmarkToCanvas(lm, crop, vw, vh, canvasW, canvasH, mirrored);
      tracked[idx] = getSmoothedPoint(idx, mapped, smoothBuffer, 0.34);
    }

    const s11 = tracked[LM.LEFT_SHOULDER];
    const s12 = tracked[LM.RIGHT_SHOULDER];
    if (s11 && s12) {
      avgConfidence = (s11.visibility + s12.visibility) / 2;
      const shoulderDist = Math.hypot(s12.x - s11.x, s12.y - s11.y);
      hasConfidentUpperPose = avgConfidence >= 0.42 && shoulderDist >= canvasW * 0.08;
    }
  } else {
    // Decay buffer gently when user steps out of frame
    for (const k of Object.keys(smoothBuffer)) {
      delete smoothBuffer[Number(k)];
    }
  }

  // Check if lower body (hips) is clearly visible inside the viewport
  const h23 = tracked[LM.LEFT_HIP];
  const h24 = tracked[LM.RIGHT_HIP];
  const hipsInFrame = Boolean(
    hasConfidentUpperPose &&
      h23 &&
      h24 &&
      h23.visibility >= 0.42 &&
      h24.visibility >= 0.42 &&
      h23.y < canvasH * 0.92 &&
      h24.y < canvasH * 0.92
  );

  const bodyVisibility: "full" | "upper" | "none" = !hasConfidentUpperPose
    ? "none"
    : hipsInFrame
    ? "full"
    : "upper";

  // =========================================================================
  // MODE A: REAL-TIME AR GARMENT OVERLAY ON USER'S LIVE BODY
  // =========================================================================
  if (mode === "ar_garment" && garmentAsset) {
    // Choose between top-only vs full-set sprite dynamically when set to "auto"
    const useFullSprite =
      cropMode === "full_set" || (cropMode === "auto" && hipsInFrame);
    const activeSprite = useFullSprite ? garmentAsset.fullCanvas : garmentAsset.topCanvas;

    const spriteMidX = (garmentAsset.leftShoulder.x + garmentAsset.rightShoulder.x) / 2;
    const spriteMidY = (garmentAsset.leftShoulder.y + garmentAsset.rightShoulder.y) / 2;
    const spriteAngle = Math.atan2(
      garmentAsset.rightShoulder.y - garmentAsset.leftShoulder.y,
      garmentAsset.rightShoulder.x - garmentAsset.leftShoulder.x
    );

    if (hasConfidentUpperPose && tracked[LM.LEFT_SHOULDER] && tracked[LM.RIGHT_SHOULDER]) {
      const sA = tracked[LM.LEFT_SHOULDER]!;
      const sB = tracked[LM.RIGHT_SHOULDER]!;
      // Always bind visual left shoulder -> visual right shoulder so sprite stays upright
      const userLeft = sA.x <= sB.x ? sA : sB;
      const userRight = sA.x <= sB.x ? sB : sA;

      const userMidX = (userLeft.x + userRight.x) / 2;
      const userMidY = (userLeft.y + userRight.y) / 2;
      const userAngle = Math.atan2(userRight.y - userLeft.y, userRight.x - userLeft.x);
      const userShoulderW = Math.hypot(userRight.x - userLeft.x, userRight.y - userLeft.y);

      const scaleX = (userShoulderW / garmentAsset.shoulderWidth) * 1.18 * options.manualScale;

      let scaleY = scaleX;
      if (hipsInFrame && h23 && h24) {
        const userHipMidY = (h23.y + h24.y) / 2;
        const userTorsoH = Math.max(40, userHipMidY - userMidY);
        const rawScaleY = (userTorsoH / garmentAsset.torsoHeight) * 1.06 * options.manualScale;
        scaleY = clamp(rawScaleY, scaleX * 0.85, scaleX * 1.18);
      }

      ctx.save();
      ctx.translate(
        userMidX + options.manualOffsetX,
        userMidY - userShoulderW * 0.03 + options.manualOffsetY
      );
      ctx.rotate(userAngle - spriteAngle);
      ctx.scale(scaleX, scaleY);
      ctx.globalAlpha = clamp(options.garmentOpacity, 0.25, 1);
      ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(activeSprite, -spriteMidX, -spriteMidY);
      ctx.restore();

      // Subtle green live pose tracking dots & shoulder line if guide toggle ON
      if (options.showTrackingGuide) {
        drawLiveSkeletonOverlay(ctx, userLeft, userRight, tracked);
      }
    } else {
      // Friendly floating translucent preview when user isn't inside shoulder range yet
      const pulse = 0.52 + 0.06 * Math.sin(options.timeMs * 0.004);
      const fallbackWidth = canvasW * 0.56 * options.manualScale;
      const scaleF = fallbackWidth / garmentAsset.shoulderWidth;
      ctx.save();
      ctx.translate(canvasW * 0.5 + options.manualOffsetX, canvasH * 0.42 + options.manualOffsetY);
      ctx.scale(scaleF, scaleF);
      ctx.globalAlpha = pulse;
      ctx.drawImage(activeSprite, -spriteMidX, -spriteMidY);
      ctx.restore();
    }
  }

  // =========================================================================
  // MODE B: REAL-TIME AR COSPLAY STUDIO (Live Face on Full Studio Outfit)
  // =========================================================================
  if (mode === "ar_cosplay" && heroImageEl) {
    const heroW = heroImageEl.width || 800;
    const heroH = heroImageEl.height || 1000;
    const hCrop = getVideoCoverCrop(heroW, heroH, canvasW, canvasH);

    // 1. Draw Studio Outfit Background crisp on full canvas
    ctx.drawImage(
      heroImageEl,
      hCrop.sx,
      hCrop.sy,
      hCrop.sw,
      hCrop.sh,
      0,
      0,
      canvasW,
      canvasH
    );

    // 2. Map model's detected head position accurately through hero object-cover crop onto canvas
    const rawHeadX = garmentAsset ? garmentAsset.headCenter.x / garmentAsset.width : 0.5;
    const rawHeadY = garmentAsset ? garmentAsset.headCenter.y / garmentAsset.height : 0.175;
    const rawHeadRX = garmentAsset ? garmentAsset.headCenter.radiusX / garmentAsset.width : 0.085;
    const rawHeadRY = garmentAsset ? garmentAsset.headCenter.radiusY / garmentAsset.height : 0.1;

    const canvasHeadNormX = ((rawHeadX * heroW) - hCrop.sx) / Math.max(1, hCrop.sw);
    const canvasHeadNormY = ((rawHeadY * heroH) - hCrop.sy) / Math.max(1, hCrop.sh);
    const scaledRX = (rawHeadRX * heroW) / Math.max(1, hCrop.sw);
    const scaledRY = (rawHeadRY * heroH) / Math.max(1, hCrop.sh);

    const dstHeadX = canvasHeadNormX * canvasW + options.manualOffsetX;
    const dstHeadY = canvasHeadNormY * canvasH + options.manualOffsetY;
    const dstW = Math.max(96, scaledRX * 2.15 * canvasW) * options.manualScale;
    const dstH = Math.max(118, scaledRY * 2.25 * canvasH) * options.manualScale;

    // 3. Determine user's live head crop from camera feed
    let userFaceX = canvasW * 0.5;
    let userFaceY = canvasH * 0.34;
    let userFaceRadius = canvasW * 0.18;
    let headTiltAngle = 0;

    const nose = tracked[LM.NOSE];
    const eyeL = tracked[LM.LEFT_EYE];
    const eyeR = tracked[LM.RIGHT_EYE];
    const earL = tracked[LM.LEFT_EAR];
    const earR = tracked[LM.RIGHT_EAR];

    if (nose && nose.visibility >= 0.4) {
      userFaceX = nose.x;
      userFaceY = nose.y - canvasH * 0.015;
      if (earL && earR && earL.visibility >= 0.3 && earR.visibility >= 0.3) {
        userFaceRadius = clamp(Math.hypot(earR.x - earL.x, earR.y - earL.y) * 0.88, 70, 220);
      } else if (eyeL && eyeR) {
        userFaceRadius = clamp(Math.hypot(eyeR.x - eyeL.x, eyeR.y - eyeL.y) * 2.1, 70, 220);
      }
      if (eyeL && eyeR) {
        const eLeft = eyeL.x <= eyeR.x ? eyeL : eyeR;
        const eRight = eyeL.x <= eyeR.x ? eyeR : eyeL;
        headTiltAngle = clamp(
          Math.atan2(eRight.y - eLeft.y, eRight.x - eLeft.x),
          -0.4,
          0.4
        );
      }
    }

    // Crop user's live face directly from video using reusable small offscreen canvas (zero GC)
    if (!reusableFaceCanvas) {
      reusableFaceCanvas = document.createElement("canvas");
    }
    const faceW = Math.max(40, Math.round(dstW));
    const faceH = Math.max(48, Math.round(dstH));
    if (reusableFaceCanvas.width !== faceW || reusableFaceCanvas.height !== faceH) {
      reusableFaceCanvas.width = faceW;
      reusableFaceCanvas.height = faceH;
    }

    const fcCtx = reusableFaceCanvas.getContext("2d");
    if (fcCtx) {
      const srcSide = userFaceRadius * 2;
      const boxLeft = clamp(userFaceX - srcSide / 2, 0, Math.max(0, canvasW - srcSide));
      const boxTop = clamp(userFaceY - srcSide * 0.58, 0, Math.max(0, canvasH - srcSide * 1.2));
      const boxW = Math.min(canvasW - boxLeft, srcSide);
      const boxH = Math.min(canvasH - boxTop, srcSide * 1.2);

      // Map screen crop box back to un-mirrored video source pixels
      const normLeft = mirrored ? 1 - (boxLeft + boxW) / canvasW : boxLeft / canvasW;
      const normTop = boxTop / canvasH;
      const rawSrcX = crop.sx + normLeft * crop.sw;
      const rawSrcY = crop.sy + normTop * crop.sh;
      const rawSrcW = (boxW / canvasW) * crop.sw;
      const rawSrcH = (boxH / canvasH) * crop.sh;

      fcCtx.globalCompositeOperation = "source-over";
      fcCtx.clearRect(0, 0, faceW, faceH);
      if (rawSrcW > 2 && rawSrcH > 2) {
        fcCtx.save();
        if (mirrored) {
          fcCtx.translate(faceW, 0);
          fcCtx.scale(-1, 1);
        }
        fcCtx.drawImage(video, rawSrcX, rawSrcY, rawSrcW, rawSrcH, 0, 0, faceW, faceH);
        fcCtx.restore();
      }

      // Smooth elliptical edge feather so live webcam face blends into hair/hijab/collar
      fcCtx.globalCompositeOperation = "destination-in";
      fcCtx.save();
      fcCtx.translate(faceW / 2, faceH / 2);
      fcCtx.scale(1, faceH / faceW);
      const r = faceW / 2;
      const grad = fcCtx.createRadialGradient(0, 0, r * 0.54, 0, 0, r * 0.98);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.74, "rgba(0,0,0,0.92)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      fcCtx.fillStyle = grad;
      fcCtx.beginPath();
      fcCtx.arc(0, 0, r, 0, Math.PI * 2);
      fcCtx.fill();
      fcCtx.restore();

      ctx.save();
      ctx.translate(dstHeadX, dstHeadY);
      ctx.rotate(headTiltAngle);
      ctx.globalAlpha = clamp(options.garmentOpacity, 0.5, 1);
      ctx.drawImage(reusableFaceCanvas, -dstW / 2, -dstH / 2);
      ctx.restore();
    }
  }

  return {
    poseDetected: hasConfidentUpperPose,
    confidence: avgConfidence,
    bodyVisibility,
  };
}

function drawLiveSkeletonOverlay(
  ctx: CanvasRenderingContext2D,
  userLeft: NormalizedPoint,
  userRight: NormalizedPoint,
  tracked: Partial<Record<number, NormalizedPoint>>
): void {
  ctx.save();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.78)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(userLeft.x, userLeft.y);
  ctx.lineTo(userRight.x, userRight.y);

  const h23 = tracked[LM.LEFT_HIP];
  const h24 = tracked[LM.RIGHT_HIP];
  if (h23 && h24 && h23.visibility > 0.4 && h24.visibility > 0.4) {
    const hLeft = h23.x <= h24.x ? h23 : h24;
    const hRight = h23.x <= h24.x ? h24 : h23;
    ctx.lineTo(hRight.x, hRight.y);
    ctx.lineTo(hLeft.x, hLeft.y);
    ctx.closePath();
  }
  ctx.stroke();

  // Joint markers
  ctx.setLineDash([]);
  for (const pt of [userLeft, userRight]) {
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}
