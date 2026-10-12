const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const QUESTIONS = [
  {
    id: "kh-01", category: "한국사",
    question: "고조선의 법으로, 원래 8개 조항 가운데 3개 조항만 『한서』 지리지에 전해지는 것은?",
    choices: ["경국대전", "8조법(범금 8조)", "대전회통", "대명률"],
    answer: 1,
    explanation: "고조선의 8조법은 살인·상해·절도에 관한 3개 조항만 『한서』 지리지에 전해진다.",
    source: { name: "한국민족문화대백과사전 '팔조법금' 항목", url: "https://encykorea.aks.ac.kr/Article/E0059778" }
  },
  {
    id: "kh-02", category: "한국사",
    question: "1971년 충청남도 공주에서 발견되었고, 함께 나온 지석 덕분에 무덤 주인을 알 수 있게 된 백제 왕릉은?",
    choices: ["천마총", "장군총", "무령왕릉", "무용총"],
    answer: 2,
    explanation: "무령왕릉은 1971년 공주에서 발견되었으며, 지석에 백제 사마왕(무령왕)이 523년에 죽었다는 내용이 새겨져 있다.",
    source: { name: "한국민족문화대백과사전 '무령왕릉 지석' 항목", url: "https://encykorea.aks.ac.kr/Article/E0054249" }
  },
  {
    id: "kh-03", category: "한국사",
    question: "고구려 유민과 말갈인을 이끌고 동모산에 도읍을 정해 발해를 세운 인물은?",
    choices: ["대조영", "견훤", "궁예", "왕건"],
    answer: 0,
    explanation: "대조영(고왕)은 698년 동모산에서 나라를 세웠고, 이 나라는 713년 무렵부터 발해라는 이름을 썼다.",
    source: { name: "한국민족문화대백과사전 '고왕' 항목", url: "https://encykorea.aks.ac.kr/Article/E0003841" }
  },
  {
    id: "kh-04", category: "한국사",
    question: "958년 후주에서 귀화한 쌍기의 건의를 받아들여 과거제를 처음 시행한 고려의 왕은?",
    choices: ["태조", "성종", "공민왕", "광종"],
    answer: 3,
    explanation: "고려 광종은 958년(광종 9) 과거제를 시행해 새 인재를 관리로 뽑으며 왕권을 강화했다.",
    source: { name: "한국민족문화대백과사전 '광종' 항목", url: "https://encykorea.aks.ac.kr/Article/E0005220" }
  },
  {
    id: "kh-05", category: "한국사",
    question: "1377년 청주 흥덕사에서 금속활자로 찍었으며, 현재 하권이 프랑스 국립도서관에 소장된 책은?",
    choices: ["무구정광대다라니경", "직지심체요절", "팔만대장경", "삼국사기"],
    answer: 1,
    explanation: "『직지심체요절』은 1377년 흥덕사에서 금속활자로 찍은 책으로, 남아 있는 하권은 프랑스 국립도서관에 있다.",
    source: { name: "한국민족문화대백과사전 '직지심체요절 권하' 항목", url: "https://encykorea.aks.ac.kr/Article/E0071845" }
  },
  {
    id: "kh-06", category: "한국사",
    question: "1592년 이순신이 학익진을 펼쳐 한산섬 앞바다에서 일본 수군의 주력을 무찌른 싸움은?",
    choices: ["명량 해전", "노량 해전", "행주 대첩", "한산도 대첩"],
    answer: 3,
    explanation: "한산도 대첩(1592)에서 이순신은 일본 수군을 넓은 바다로 끌어내 학익진으로 포위해 크게 이겼다.",
    source: { name: "한국민족문화대백과사전 '한산도대첩' 항목", url: "https://encykorea.aks.ac.kr/Article/E0061676" }
  },
  {
    id: "kh-07", category: "한국사",
    question: "정조 때 정약용이 도르래를 이용해 만든 거중기를 사용해 쌓은 성은?",
    choices: ["수원 화성", "남한산성", "북한산성", "한양도성"],
    answer: 0,
    explanation: "수원 화성은 정약용이 만든 거중기 등을 활용해 1794년에 쌓기 시작해 1796년에 완성했다.",
    source: { name: "한국민족문화대백과사전 '수원시' 항목", url: "https://encykorea.aks.ac.kr/Article/E0031604" }
  },
  {
    id: "kh-08", category: "한국사",
    question: "1884년 김옥균 등 급진 개화파가 우정총국 개국 축하연을 틈타 일으킨 정변은?",
    choices: ["임오군란", "갑신정변", "을미사변", "갑오개혁"],
    answer: 1,
    explanation: "갑신정변은 1884년 12월 4일 우정총국 축하연을 계기로 일어났으나 청군의 개입으로 3일 만에 실패했다.",
    source: { name: "한국민족문화대백과사전 '갑신정변' 항목", url: "https://encykorea.aks.ac.kr/Article/E0000922" }
  },
  {
    id: "kh-09", category: "한국사",
    question: "3·1 운동 이후 1919년 4월 대한민국 임시정부가 처음 수립된 도시는?",
    choices: ["충칭", "도쿄", "상하이", "베이징"],
    answer: 2,
    explanation: "대한민국 임시정부는 1919년 4월 11일 중국 상하이에서 수립되었고, 충칭에는 1940년에 옮겨 갔다.",
    source: { name: "한국민족문화대백과사전 '대한민국 임시정부 수립 기념일' 항목", url: "https://encykorea.aks.ac.kr/Article/E0080590" }
  },
  {
    id: "kh-10", category: "한국사",
    question: "1960년 3·15 부정 선거에 맞선 시위가 번져 이승만 대통령이 물러나게 된 민주 혁명은?",
    choices: ["부마 민주 항쟁", "5·18 민주화 운동", "6월 민주 항쟁", "4·19 혁명"],
    answer: 3,
    explanation: "4·19 혁명은 3·15 부정 선거에 대한 분노로 번진 시위로, 이승만은 1960년 4월 26일 사임을 발표했다.",
    source: { name: "한국민족문화대백과사전 '4·19혁명' 항목", url: "https://encykorea.aks.ac.kr/Article/E0025902" }
  }
];
