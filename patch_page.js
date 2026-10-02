const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Fix the corrupted useEffect
const badEffectRegex = /if \(hasOnboarded === null\) return null;\s*if \(\!hasOnboarded\) \{\s*return <OnboardingFlow onComplete=\{handleCompleteOnboarding\} \/>;\s*\}\s*return \(\) => \{/;

content = content.replace(badEffectRegex, "return () => {");

// Now safely inject it before the main `return (`
const mainReturnRegex = /return \(\s*<div className="min-h-screen/m;

const correctInjection = `if (hasOnboarded === null) return null;

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen`;

content = content.replace(mainReturnRegex, correctInjection);

fs.writeFileSync(file, content, 'utf8');
