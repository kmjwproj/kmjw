import Link from 'next/link';

// ─────────────────────────────────────────────
// TODO: 아래 상수들을 실제 서비스 정보로 교체하세요
// ─────────────────────────────────────────────
const SERVICE_NAME = '[서비스명]';
const COMPANY_NAME = '[회사명 / 운영자명]';
const REPRESENTATIVE = '[대표자명]';
const BIZ_REG_NUMBER = '[사업자등록번호]';
const ADDRESS = '[사업장 주소]';
const CONTACT_EMAIL = '[고객센터 이메일]';
const CONTACT_PHONE = '[고객센터 전화번호]';
const EFFECTIVE_DATE = '[시행일자 예: 2025년 1월 1일]';
// ─────────────────────────────────────────────

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-sm">
        <Link
          href="/login"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-[17px] font-semibold text-gray-900">서비스 이용약관</h1>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 px-5 py-8 text-[14px] leading-relaxed text-gray-700">
        <p className="text-xs text-gray-400">시행일: {EFFECTIVE_DATE}</p>

        {/* 제1조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">제1조 (목적)</h2>
          <p>
            이 약관은 {COMPANY_NAME}(이하 &quot;회사&quot;)가 운영하는 {SERVICE_NAME}
            (이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리·의무 및
            책임사항,
            기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제2조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">제2조 (정의)</h2>
          <ul className="space-y-2">
            <li>
              ① <strong>&quot;서비스&quot;</strong>란 회사가 제공하는 {SERVICE_NAME}{' '}
              플랫폼 및 관련 제반 서비스를 의미합니다.
            </li>
            <li>
              ② <strong>&quot;이용자&quot;</strong>란 이 약관에 따라 회사가 제공하는
              서비스를 받는 회원 및 비회원을 말합니다.
            </li>
            <li>
              ③ <strong>&quot;회원&quot;</strong>이란 회사에 개인정보를 제공하고 회원
              등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를
              계속적으로 이용할 수 있는 자를 말합니다.
            </li>
            <li>
              ④ <strong>&quot;콘텐츠&quot;</strong>란 회원이 서비스에 게시하는 텍스트,
              이미지, 영상, 파일 등 일체의 정보를 말합니다.
            </li>
          </ul>
        </section>

        {/* 제3조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제3조 (약관의 게시 및 개정)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기
              화면에 게시합니다.
            </li>
            <li>
              ② 회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의
              규제에 관한 법률」 등 관련 법을 위배하지 않는 범위에서 이 약관을
              개정할 수 있습니다.
            </li>
            <li>
              ③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
              현행 약관과 함께 서비스 내 공지사항 화면에 그 적용일자 7일 이전부터
              공지합니다. 단, 이용자에게 불리하거나 중대한 사항의 변경은 30일
              이전부터 공지합니다.
            </li>
          </ul>
        </section>

        {/* 제4조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제4조 (회원가입 및 서비스 이용)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이
              약관에 동의한다는 의사 표시를 함으로써 회원가입을 신청합니다.
            </li>
            <li>
              ② 서비스는 소셜 로그인(카카오, X, 라인 등)을 통해 가입할 수 있으며,
              해당 제3자 플랫폼의 정책에도 동의한 것으로 간주합니다.
            </li>
            <li>
              ③ 만 14세 미만의 아동은 서비스에 가입할 수 없습니다.
            </li>
          </ul>
        </section>

        {/* 제5조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제5조 (이용자의 의무)
          </h2>
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>타인의 정보 도용 또는 허위 정보 등록</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는 게시</li>
            <li>회사 또는 제3자의 저작권 등 지식재산권 침해</li>
            <li>회사 또는 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>음란 또는 폭력적인 메시지, 영상, 음성 등의 게시·전송</li>
            <li>
              기타 불법적이거나 부당한 행위 {/* TODO: 서비스 특성에 맞게 금지행위 추가 */}
            </li>
          </ul>
        </section>

        {/* 제6조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제6조 (서비스 제공 및 변경)
          </h2>
          <ul className="space-y-2">
            <li>① 회사는 다음과 같은 서비스를 제공합니다.</li>
            <ul className="list-disc space-y-1 pl-5">
              {/* TODO: 실제 서비스 기능 목록으로 교체 */}
              <li>[핵심 기능 1]</li>
              <li>[핵심 기능 2]</li>
              <li>[핵심 기능 3]</li>
              <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
            </ul>
            <li>
              ② 회사는 서비스의 내용, 이용 방법, 이용 시간에 대하여 변경이 있는
              경우에는 변경 사유, 변경될 서비스의 내용 및 제공일자 등을
              서비스 내 공지사항 화면에 게시합니다.
            </li>
          </ul>
        </section>

        {/* 제7조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제7조 (서비스 중단)
          </h2>
          <p>
            회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절
            등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수
            있으며, 이에 대해 회사는 고의 또는 과실이 없는 한 책임지지 않습니다.
          </p>
        </section>

        {/* 제8조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제8조 (게시물의 관리)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회원의 게시물이 타인의 권리를 침해하거나 서비스 운영 정책에
              위반되는 경우 회사는 해당 게시물을 삭제하거나 접근을 차단할 수
              있습니다.
            </li>
            <li>
              ② 게시물에 대한 저작권은 게시한 회원에게 있으며, 회사는 서비스
              운영, 홍보, 개선을 위한 범위 내에서 이를 활용할 수 있습니다.
            </li>
          </ul>
        </section>

        {/* 제9조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제9조 (계약 해지 및 탈퇴)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴를 요청할 수 있으며,
              회사는 즉시 처리합니다.
            </li>
            <li>
              ② 탈퇴 시 회원의 게시물은 삭제되며, 복구할 수 없습니다. 단, 다른
              회원과 공유된 콘텐츠는 즉시 삭제되지 않을 수 있습니다.
            </li>
          </ul>
        </section>

        {/* 제10조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제10조 (면책조항)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중단 등 불가항력으로
              인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
            </li>
            <li>
              ② 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을
              지지 않습니다.
            </li>
            <li>
              ③ 회사는 이용자가 서비스를 통해 게재한 정보, 자료, 사실의 신뢰도,
              정확성 등의 내용에 관해서는 책임을 지지 않습니다.
            </li>
          </ul>
        </section>

        {/* 제11조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제11조 (분쟁 해결 및 준거법)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호
              협의하여 해결을 위해 노력합니다.
            </li>
            <li>
              ② 이 약관은 대한민국 법령에 의하여 규정되고 이행됩니다.
            </li>
            <li>
              ③ 서비스 이용과 관련하여 분쟁이 있는 경우 관할 법원은 민사소송법에
              따릅니다.
            </li>
          </ul>
        </section>

        {/* 운영자 정보 */}
        <section className="space-y-2 rounded-2xl bg-gray-50 p-5 text-xs text-gray-500">
          <p className="font-semibold text-gray-700">운영자 정보</p>
          <p>상호: {COMPANY_NAME}</p>
          <p>대표자: {REPRESENTATIVE}</p>
          <p>사업자등록번호: {BIZ_REG_NUMBER}</p>
          <p>주소: {ADDRESS}</p>
          <p>고객센터: {CONTACT_EMAIL} / {CONTACT_PHONE}</p>
        </section>

        <p className="text-center text-xs text-gray-400 pb-4">
          본 약관은 {EFFECTIVE_DATE}부터 시행됩니다.
        </p>
      </article>
    </div>
  );
}
