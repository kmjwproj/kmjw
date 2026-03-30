import type { ChatRoom } from './chat'
import mock1 from './mock1.png'
import mock2 from './mock2.png'

const avatars = [mock1, mock2]
const r = (i: number) => avatars[i % 2]

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  { id: '1',  participantName: '김지수', participantAvatar: r(0), lastMessage: '내일 뵙겠습니다', lastMessageAt: '오전 11:20', isRead: true,  lastSentByMe: false },
  { id: '2',  participantName: '이민준', participantAvatar: r(1), lastMessage: '좋아요, 그렇게 하죠', lastMessageAt: '오후 2:45', isRead: false, lastSentByMe: true },
  { id: '3',  participantName: '박서연', participantAvatar: r(0), lastMessage: '프로젝트 일정 확인했습니다', lastMessageAt: '어제', isRead: true,  lastSentByMe: false },
  { id: '4',  participantName: '최현우', participantAvatar: r(1), lastMessage: '감사합니다!', lastMessageAt: '월', isRead: true,  lastSentByMe: true },
  { id: '5',  participantName: '정다은', participantAvatar: r(0), lastMessage: '회의실에서 봐요', lastMessageAt: '오전 9:15', isRead: false, lastSentByMe: false },
  { id: '6',  participantName: '윤도현', participantAvatar: r(1), lastMessage: '네, 알겠습니다', lastMessageAt: '화', isRead: true,  lastSentByMe: true },
  { id: '7',  participantName: '강예린', participantAvatar: r(0), lastMessage: '내 생각엔 이게 맞을 것 같아', lastMessageAt: '오후 4:30', isRead: false, lastSentByMe: false },
  { id: '8',  participantName: '임재원', participantAvatar: r(1), lastMessage: '코드 리뷰 부탁합니다', lastMessageAt: '목', isRead: true,  lastSentByMe: true },
  { id: '9',  participantName: '오소연', participantAvatar: r(0), lastMessage: '완료되었습니다', lastMessageAt: '오전 8:45', isRead: true,  lastSentByMe: false },
  { id: '10', participantName: '한승민', participantAvatar: r(1), lastMessage: '좋은 아이디어네요!', lastMessageAt: '금', isRead: false, lastSentByMe: true },
  { id: '11', participantName: '신유진', participantAvatar: r(0), lastMessage: '언제 시간 되세요?', lastMessageAt: '오후 1:10', isRead: false, lastSentByMe: false },
  { id: '12', participantName: '류성준', participantAvatar: r(1), lastMessage: '파일 보내드렸어요', lastMessageAt: '어제', isRead: true,  lastSentByMe: false },
  { id: '13', participantName: '노하은', participantAvatar: r(0), lastMessage: '확인해볼게요', lastMessageAt: '수', isRead: true,  lastSentByMe: true },
  { id: '14', participantName: '배준혁', participantAvatar: r(1), lastMessage: '오늘 저녁 어때요?', lastMessageAt: '오전 10:05', isRead: false, lastSentByMe: false },
  { id: '15', participantName: '전소희', participantAvatar: r(0), lastMessage: '감사해요 :)', lastMessageAt: '토', isRead: true,  lastSentByMe: false },
  { id: '16', participantName: '황민석', participantAvatar: r(1), lastMessage: '내일 봬요!', lastMessageAt: '오후 5:00', isRead: false, lastSentByMe: true },
  { id: '17', participantName: '조아름', participantAvatar: r(0), lastMessage: '알려주셔서 감사합니다', lastMessageAt: '일', isRead: true,  lastSentByMe: false },
  { id: '18', participantName: '문태양', participantAvatar: r(1), lastMessage: '다음 주에 다시 얘기해요', lastMessageAt: '지난주', isRead: true,  lastSentByMe: true },
  { id: '19', participantName: '심나연', participantAvatar: r(0), lastMessage: '좋아요!', lastMessageAt: '오전 7:30', isRead: false, lastSentByMe: false },
  { id: '20', participantName: '권도윤', participantAvatar: r(1), lastMessage: '방금 확인했어요', lastMessageAt: '오후 3:55', isRead: true,  lastSentByMe: false },
  { id: '21', participantName: '장수빈', participantAvatar: r(0), lastMessage: '네, 맞아요', lastMessageAt: '어제', isRead: false, lastSentByMe: false },
  { id: '22', participantName: '서지훈', participantAvatar: r(1), lastMessage: '수고하셨어요', lastMessageAt: '월', isRead: true,  lastSentByMe: true },
  { id: '23', participantName: '이채원', participantAvatar: r(0), lastMessage: '언제 올 수 있어요?', lastMessageAt: '오전 11:50', isRead: false, lastSentByMe: false },
  { id: '24', participantName: '박태준', participantAvatar: r(1), lastMessage: '잘 부탁드립니다', lastMessageAt: '화', isRead: true,  lastSentByMe: false },
  { id: '25', participantName: '김민아', participantAvatar: r(0), lastMessage: '오늘도 화이팅!', lastMessageAt: '오후 12:00', isRead: false, lastSentByMe: true },
]
