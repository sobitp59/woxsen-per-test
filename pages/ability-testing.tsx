// pages/ability-testing.tsx
import { useRouter } from 'next/router';
import AbilityQuestions from '../components/test/ability-test';

export default function AbilityTestingPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the homepage after completing the ability test
    router.push('/');
  };

  return <AbilityQuestions onComplete={handleComplete} />;
}
