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
  },
  {
    id: "wg-01", category: "세계지리",
    question: "1927년 연방 의회가 멜버른에서 옮겨 온 오스트레일리아의 수도는?",
    choices: ["시드니", "브리즈번", "캔버라", "퍼스"],
    answer: 2,
    explanation: "캔버라는 1911년 국제 설계 공모에서 뽑힌 월터 벌리 그리핀의 계획에 따라 1913년 건설이 시작되었고, 1927년 5월 9일 연방 의회가 멜버른에서 이곳으로 옮겨 왔다.",
    source: { name: "브리태니커 'Canberra' 항목", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "wg-02", category: "세계지리",
    question: "남태평양 고기압과 페루(훔볼트) 해류의 영향으로 몹시 건조한 사막은?",
    choices: ["사하라 사막", "고비 사막", "칼라하리 사막", "아타카마 사막"],
    answer: 3,
    explanation: "칠레 북부의 아타카마 사막은 남태평양 고기압의 하강 기류와 차가운 페루(훔볼트) 해류 때문에 세계에서 손꼽히게 건조한 지역이다.",
    source: { name: "브리태니커 'Atacama Desert' 항목", url: "https://www.britannica.com/place/Atacama-Desert" }
  },
  {
    id: "wg-03", category: "세계지리",
    question: "쾨펜 기후 구분에서 여름은 덥고 건조하며 겨울은 서늘하고 비가 많고, 주로 위도 30°~45°의 대륙 서안에 나타나는 기후는?",
    choices: ["서안 해양성 기후", "지중해성 기후", "온난 습윤 기후", "사바나 기후"],
    answer: 1,
    explanation: "지중해성 기후(Cs)는 여름에 아열대 고기압의 영향으로 맑고 덥고 건조하며, 겨울에는 이동성 저기압이 비를 내린다.",
    source: { name: "브리태니커 'Mediterranean climate' 항목", url: "https://www.britannica.com/science/Mediterranean-climate" }
  },
  {
    id: "wg-04", category: "세계지리",
    question: "빙하가 깎아 만든 U자형 골짜기에 바닷물이 들어와 생긴 좁고 긴 만으로, 노르웨이 서해안에서 잘 볼 수 있는 지형은?",
    choices: ["피오르", "리아스 해안", "석호", "삼각주"],
    answer: 0,
    explanation: "피오르는 빙하가 침식한 U자곡이 바다에 잠겨 생긴 좁고 긴 만으로, 노르웨이의 송네 피오르는 깊이가 1,308m에 이른다.",
    source: { name: "브리태니커 'fjord' 항목", url: "https://www.britannica.com/science/fjord" }
  },
  {
    id: "wg-05", category: "세계지리",
    question: "독일 슈바르츠발트(검은 숲)에서 발원해 빈·부다페스트·베오그라드를 지나 흑해로 흘러드는 강은?",
    choices: ["라인강", "다뉴브강(도나우강)", "볼가강", "엘베강"],
    answer: 1,
    explanation: "다뉴브강(도나우강)은 독일 슈바르츠발트에서 발원해 10개 나라를 지나 흑해로 흘러들며, 강가에 빈·부다페스트·베오그라드 같은 수도가 있다.",
    source: { name: "브리태니커 'Danube River' 항목", url: "https://www.britannica.com/place/Danube-River" }
  },
  {
    id: "wg-06", category: "세계지리",
    question: "잠비아와 짐바브웨의 국경을 흐르는 잠베지강에 있으며, 현지에서 '모시오아툰야(천둥 치는 연기)'라고 불리는 폭포는?",
    choices: ["이구아수 폭포", "나이아가라 폭포", "빅토리아 폭포", "앙헬 폭포"],
    answer: 2,
    explanation: "빅토리아 폭포는 잠베지강의 잠비아–짐바브웨 국경에 있으며, 1855년 이 폭포를 본 리빙스턴이 빅토리아 여왕의 이름을 붙였다.",
    source: { name: "브리태니커 'Victoria Falls' 항목", url: "https://www.britannica.com/place/Victoria-Falls-waterfall-Zambia-Zimbabwe" }
  },
  {
    id: "wg-07", category: "세계지리",
    question: "흑해와 마르마라해를 잇고, 튀르키예의 아시아 쪽(아나톨리아)과 유럽 쪽을 가르는 해협은?",
    choices: ["지브롤터 해협", "말라카 해협", "호르무즈 해협", "보스포루스 해협"],
    answer: 3,
    explanation: "보스포루스 해협은 흑해와 마르마라해를 잇는 길이 약 30km의 해협으로, 남쪽 끝에 이스탄불이 걸쳐 있다.",
    source: { name: "브리태니커 'Bosporus' 항목", url: "https://www.britannica.com/place/Bosporus" }
  },
  {
    id: "wg-08", category: "세계지리",
    question: "1914년에 완공된 갑문식 운하인 파나마 운하가 파나마 지협을 가로질러 잇는 두 대양은?",
    choices: ["대서양과 태평양", "대서양과 인도양", "인도양과 태평양", "태평양과 북극해"],
    answer: 0,
    explanation: "파나마 운하는 파나마 지협을 가로질러 대서양(카리브해)과 태평양을 잇는 갑문식 운하로, 1999년 12월 31일 파나마가 완전한 통제권을 넘겨받았다.",
    source: { name: "브리태니커 'Panama Canal' 항목", url: "https://www.britannica.com/topic/Panama-Canal" }
  },
  {
    id: "wg-09", category: "세계지리",
    question: "UN 경제사회국(DESA) 추계 기준, 2023년에 중국을 앞질러 세계에서 인구가 가장 많은 나라가 된 것으로 추산된 나라는?",
    choices: ["인도", "미국", "인도네시아", "파키스탄"],
    answer: 0,
    explanation: "UN 경제사회국 인구국은 2023년 4월 중국이 오랫동안 지켜 온 세계 최다 인구국 자리를 인도에 넘겨줄 것으로 추계했다.",
    source: { name: "UN DESA 인구국 'India overtakes China as the world's most populous country'", url: "https://www.un.org/development/desa/pd/node/4293" }
  },
  {
    id: "wg-10", category: "세계지리",
    question: "인도 아대륙을 실은 판이 북쪽으로 이동해 어느 판과 충돌하면서 히말라야 산맥이 만들어졌는가?",
    choices: ["태평양판", "유라시아판", "아프리카판", "남아메리카판"],
    answer: 1,
    explanation: "곤드와나에서 떨어져 나온 인도 아대륙은 약 4천만~5천만 년 전 유라시아와 충돌했고, 두 판의 충돌이 이어지면서 히말라야 산맥이 솟아올랐다.",
    source: { name: "브리태니커 'Himalayas' 항목", url: "https://www.britannica.com/place/Himalayas" }
  }
];
