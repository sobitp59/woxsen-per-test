import { useRouter } from 'next/router';
import InferentialAbilityQuestions from '../components/test/Inferential_test';

export default function BasicInfoPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the main test questions page
    router.push('/PersonalityScoresPage');
  };

  return <InferentialAbilityQuestions onComplete={handleComplete} />;
}