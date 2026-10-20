export interface TeacherResponse {
  speechText: string;
  language?: 'mn' | 'en';
  subtitle: string;
  mongolianHint?: string;
  encouragement?: string;
  suggestedReplies?: string[];
}

export async function sendTeacherMessage(
  message: string,
  learnerProfile: 'sister' | 'mom',
  learnerLevel: number = 2,
  languageMode: 'auto' | 'mn' | 'en' = 'auto',
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
        learnerLevel,
        languageMode,
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
    const isMn = languageMode === 'mn' || /[\u0400-\u04FF]/.test(message);

    if (learnerProfile === 'sister') {
      return {
        speechText: isMn
          ? 'Чи маш сайн хийж байна! Хамтдаа үг бүтээж, зурагтай дасгал хийцгээе! Дараа нь юу сурмаар байна вэ?'
          : 'You are doing great! Let us practice words and numbers together! What would you like to learn next?',
        language: isMn ? 'mn' : 'en',
        subtitle: isMn
          ? 'You are doing great! Let us practice words and numbers together!'
          : 'Чи маш сайн хийж байна! Хамтдаа сонирхолтой дасгалууд хийе!',
        mongolianHint: 'Бяцхан суралцагчдад зориулсан эелдэг тусламж',
        encouragement: 'Гайхалтай! Алхам алхмаар улам сайн болж байна шүү!',
        suggestedReplies: isMn
          ? ['Амьтдын нэр зааж өгөөч', '1-ээс 10 хүртэл тоолъё', 'Үсэг зурах самбар руу оръё']
          : ['Teach me animal names.', 'Let us count from 1 to 10.', 'Show me colors.'],
      };
    }

    return {
      speechText: isMn
        ? 'Маш сайн байна! Өдөр бүр шинэ зүйл сурах нь үр дүнтэй. Ярианы англи хэл, дүрмийн тайлбар эсвэл тоо бодлогын алийг нь хийх үү?'
        : 'Well done! Practicing every day improves your fluency and confidence quickly. Would you like to review practical expressions or solve a problem?',
      language: isMn ? 'mn' : 'en',
      subtitle: isMn
        ? 'Well done! Daily learning brings fast and steady improvement.'
        : 'Сайн байна! Өдөр бүр дадлага хийх нь чөлөөтэй ярих чадварыг хурдан хөгжүүлнэ.',
      mongolianHint: 'Өдөр тутмын хэрэглээний яриа ба дүрэм',
      encouragement: 'Таны хичээл зүтгэл өдөр бүр амжилт авчирч байна!',
      suggestedReplies: isMn
        ? ['Дэлгүүрт ярих ярианы жишээ', 'Англи хэлний өнгөрсөн цаг тайлбарлаач', 'Тооны бодлого бодъё']
        : ['Practice conversation for travel.', 'Explain English verb tenses.', 'Let us solve math puzzles.'],
    };
  }
}
