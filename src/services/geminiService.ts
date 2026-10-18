export interface TeacherResponse {
  speechText: string;
  subtitle: string;
  mongolianHint?: string;
  encouragement?: string;
  suggestedReplies?: string[];
}

export async function sendTeacherMessage(
  message: string,
  learnerProfile: 'sister' | 'mom',
  history: { role: string; content: string }[] = []
): Promise<TeacherResponse> {
  try {
    const res = await fetch('/api/teacher-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        learnerProfile,
        history,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Teacher API fallback initiated:', err);
    // Client-side fallback if server fails
    if (learnerProfile === 'sister') {
      return {
        speechText: 'You are doing great! Let us practice English together! What would you like to learn next?',
        subtitle: 'You are doing great! Let us practice English together! What would you like to learn next?',
        mongolianHint: 'Чи маш сайн хийж байна! Хамтдаа англиар давтъя! Дараа нь юу сурмаар байна вэ?',
        encouragement: 'Keep shining, little star!',
        suggestedReplies: ['Teach me animal names.', 'Let us count from 1 to 10.', 'I want to sing a song.'],
      };
    }
    return {
      speechText: 'Well done! Practicing every day improves your speaking fluency quickly. Would you like to review common expressions or try a quiz?',
      subtitle: 'Well done! Practicing every day improves your speaking fluency quickly. Would you like to review common expressions or try a quiz?',
      mongolianHint: 'Сайн байна! Өдөр бүр дадлага хийх нь ярианы чадварыг хурдан дээшлүүлдэг. Түгээмэл хэллэгүүдийг давтах уу эсвэл сорил өгөх үү?',
      encouragement: 'Great job continuing your English journey!',
      suggestedReplies: ['Review common expressions.', 'Practice conversation for travel.', 'Explain prepositions again.'],
    };
  }
}
