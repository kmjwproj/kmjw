import Link from 'next/link';

// ─────────────────────────────────────────────
// TODO: 아래 상수들을 실제 서비스 정보로 교체하세요
// ─────────────────────────────────────────────
const SERVICE_NAME = '[서비스명]';
const COMPANY_NAME = '[회사명 / 운영자명]';
const REPRESENTATIVE = '[대표자명]';
const BIZ_REG_NUMBER = '[사업자등록번호]';
const ADDRESS = '[사업장 주소]';
const PRIVACY_OFFICER_NAME = '[개인정보 보호책임자 이름]';
const PRIVACY_OFFICER_EMAIL = '[개인정보 보호책임자 이메일]';
const CONTACT_EMAIL = '[고객센터 이메일]';
const CONTACT_PHONE = '[고객센터 전화번호]';
const EFFECTIVE_DATE = '[시행일자 예: 2025년 1월 1일]';

// TODO: 보유기간은 데이터 종류별로 실제 정책에 맞게 조정하세요
const RETENTION_PERIOD_MEMBER = '[회원 탈퇴 후 30일]';
const RETENTION_PERIOD_LOG = '[서비스 이용 로그: 3개월]';
// ─────────────────────────────────────────────

export default function PrivacyPage() {
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
        <h1 className="text-[17px] font-semibold text-gray-900">
          개인정보 처리방침
        </h1>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 px-5 py-8 text-[14px] leading-relaxed text-gray-700">
        <p className="text-xs text-gray-400">시행일: {EFFECTIVE_DATE}</p>

        <p>
          {COMPANY_NAME}(이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라
          정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
          처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
          수립·공개합니다.
        </p>

        {/* 제1조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제1조 (개인정보의 처리 목적)
          </h2>
          <p>
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는
            다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는
            경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>회원 가입 및 관리 (본인 확인, 회원 자격 유지·관리)</li>
            <li>서비스 제공 (콘텐츠 제공, 맞춤 서비스 제공)</li>
            <li>민원 처리 (불만 처리, 공지사항 전달)</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
            {/* TODO: 서비스 특성에 맞는 처리 목적 추가 */}
          </ul>
        </section>

        {/* 제2조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제2조 (처리하는 개인정보의 항목)
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold text-gray-800">
                ① 소셜 로그인을 통해 수집되는 항목 (필수)
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-[13px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">
                        제공자
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">
                        수집 항목
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-3 py-2">카카오</td>
                      <td className="px-3 py-2 text-gray-500">
                        카카오 계정 ID, 닉네임, 프로필 이미지
                        {/* TODO: 카카오 비즈앱 신청 시 수집 항목 확정 후 업데이트 */}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">X (트위터)</td>
                      <td className="px-3 py-2 text-gray-500">
                        X 계정 ID, 사용자 이름, 프로필 이미지
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">라인</td>
                      <td className="px-3 py-2 text-gray-500">
                        라인 계정 ID, 사용자 이름, 프로필 이미지
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="mb-1 font-semibold text-gray-800">
                ② 서비스 이용 과정에서 자동 수집되는 항목
              </p>
              <ul className="list-disc space-y-1 pl-5 text-gray-500">
                <li>IP 주소, 쿠키, 서비스 이용 기록, 방문 일시</li>
                <li>기기 정보 (기기 모델, OS 버전, 브라우저 종류)</li>
                {/* TODO: 푸시 알림 등 추가 수집 항목 발생 시 업데이트 */}
              </ul>
            </div>

            <div>
              <p className="mb-1 font-semibold text-gray-800">
                ③ 온보딩 과정에서 수집되는 항목
              </p>
              <ul className="list-disc space-y-1 pl-5 text-gray-500">
                {/* TODO: 온보딩 단계에서 수집하는 항목 확정 후 업데이트 */}
                <li>[닉네임]</li>
                <li>[프로필 사진]</li>
                <li>[관심사 / 카테고리]</li>
                <li>[기타 기본 정보]</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 제3조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제3조 (개인정보의 처리 및 보유 기간)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서
              개인정보를 처리·보유합니다.
            </li>
            <li>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</li>
            <ul className="list-disc space-y-1 pl-5 text-gray-500">
              <li>회원 정보: {RETENTION_PERIOD_MEMBER}</li>
              <li>서비스 이용 로그: {RETENTION_PERIOD_LOG}</li>
              {/* TODO: 전자상거래법 등 관련 법령에 따른 보존 항목 추가 */}
            </ul>
            <li>
              ③ 관계 법령에 따라 보존해야 하는 경우 해당 기간 동안 보관합니다.
              (예: 전자상거래 등에서의 소비자보호에 관한 법률에 따른 계약·청약철회
              기록 5년, 전자금융거래법에 따른 전자금융 거래기록 5년 등)
              {/* TODO: 실제 해당되는 법령 기반 보존 기간으로 확정 */}
            </li>
          </ul>
        </section>

        {/* 제4조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제4조 (개인정보의 제3자 제공)
          </h2>
          <p>
            회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며,
            정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조에
            해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
          {/* TODO: 제3자 제공이 발생하는 경우 (광고, 파트너십 등) 아래 표 형식으로 추가 */}
          <p className="rounded-xl bg-gray-50 p-4 text-gray-500">
            현재 제3자에게 개인정보를 제공하고 있지 않습니다.
          </p>
        </section>

        {/* 제5조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제5조 (개인정보 처리 업무의 위탁)
          </h2>
          {/* TODO: 클라우드, 결제, 마케팅 도구 등 실제 수탁업체 목록으로 업데이트 */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">
                    수탁업체
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">
                    위탁 업무
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="px-3 py-2">Supabase Inc.</td>
                  <td className="px-3 py-2 text-gray-500">
                    회원 인증 및 데이터베이스 운영
                  </td>
                </tr>
                {/* TODO: 추가 수탁업체 행 삽입 */}
                {/* 예시:
                <tr>
                  <td className="px-3 py-2">[결제 대행사명]</td>
                  <td className="px-3 py-2 text-gray-500">결제 처리</td>
                </tr>
                */}
              </tbody>
            </table>
          </div>
        </section>

        {/* 제6조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제6조 (정보주체의 권리·의무 및 행사 방법)
          </h2>
          <p>
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를
            행사할 수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있는 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
          <p>
            권리 행사는 서비스 내 설정 메뉴 또는 {CONTACT_EMAIL}로 서면, 전자우편
            등을 통해 신청하실 수 있으며, 회사는 이에 대해 지체 없이 조치합니다.
          </p>
        </section>

        {/* 제7조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제7조 (개인정보의 파기)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </li>
            <li>
              ② 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록
              파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나
              소각하여 파기합니다.
            </li>
          </ul>
        </section>

        {/* 제8조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제8조 (쿠키의 사용)
          </h2>
          <ul className="space-y-2">
            <li>
              ① 회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를
              저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
            </li>
            <li>
              ② 이용자는 웹 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수
              있습니다. 단, 쿠키 저장을 거부할 경우 서비스 이용에 어려움이 있을 수
              있습니다.
            </li>
          </ul>
        </section>

        {/* 제9조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제9조 (개인정보 보호책임자)
          </h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의
            개인정보 관련 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보
            보호책임자를 지정하고 있습니다.
          </p>
          <div className="rounded-xl bg-gray-50 p-4 space-y-1 text-gray-600">
            <p className="font-semibold text-gray-800">개인정보 보호책임자</p>
            <p>성명: {PRIVACY_OFFICER_NAME}</p>
            <p>이메일: {PRIVACY_OFFICER_EMAIL}</p>
            <p>전화: {CONTACT_PHONE}</p>
          </div>
          <p>
            정보주체는 {SERVICE_NAME} 서비스를 이용하시면서 발생한 모든 개인정보
            보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 개인정보
            보호책임자에게 문의하실 수 있습니다.
          </p>
        </section>

        {/* 제10조 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제10조 (개인정보 처리방침의 변경)
          </h2>
          <p>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경
            내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터
            공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        {/* 권익 침해 구제 */}
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-gray-900">
            제11조 (권익 침해 구제 방법)
          </h2>
          <p>
            정보주체는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회,
            한국인터넷진흥원 개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할
            수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-gray-500">
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청 사이버범죄수사단: 02-3480-3573 (www.spo.go.kr)</li>
            <li>경찰청 사이버안전국: 182 (cyberbureau.police.go.kr)</li>
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
          본 개인정보 처리방침은 {EFFECTIVE_DATE}부터 시행됩니다.
        </p>
      </article>
    </div>
  );
}
