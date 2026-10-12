const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const QUESTIONS = [
  {
    id: "kh-01", category: "한국사",
    question: "살인·상해·절도에 관한 조항이 『한서』 지리지에 전해지는 고조선의 법은?",
    choices: ["경국대전", "8조법(범금 8조)", "대전회통", "대명률"],
    answer: 1,
    explanation: "고조선의 8조법은 전문이 전하지 않고 살인·상해·절도에 관한 3개 조항만 『한서』 지리지에 전해진다.",
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
    question: "1592년 이순신이 학익진으로 일본 수군의 주력을 무찌른 싸움은?",
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
    explanation: "정약용은 활차(도르래)로 거중기를 만들고 녹로를 사용해 각종 시설을 고루 갖춘 수원 화성을 쌓았다.",
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
    explanation: "대한민국 임시정부는 1919년 4월 11일 중국 상하이에 수립되었고, 1940년 9월 충칭에 정착했다.",
    source: { name: "한국민족문화대백과사전 '대한민국 임시정부' 항목", url: "https://encykorea.aks.ac.kr/Article/E0015017" }
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
  },
  {
    id: "sc-01", category: "과학",
    question: "국제단위계(SI)에서 힘의 단위는?",
    choices: ["파스칼(Pa)", "줄(J)", "뉴턴(N)", "와트(W)"],
    answer: 2,
    explanation: "뉴턴(N)은 힘의 SI 유도 단위로 SI 기본 단위로는 m·kg·s⁻²이며, 파스칼은 압력, 줄은 에너지, 와트는 일률의 단위이다.",
    source: { name: "NIST Guide to the SI (SP 811) 4장 'The Two Classes of SI Units and the SI Prefixes'", url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes" }
  },
  {
    id: "sc-02", category: "과학",
    question: "울리는 경적에 다가갈 때는 소리가 높게 들리다가 지나친 뒤에는 낮게 들리는 것처럼, 파원과 관찰자의 상대 운동 때문에 파동의 진동수가 달라져 관측되는 현상은?",
    choices: ["간섭", "회절", "공명", "도플러 효과"],
    answer: 3,
    explanation: "도플러 효과는 파원과 관찰자의 상대 운동 때문에 파동이 파원을 떠날 때와 관찰자에게 도달할 때의 진동수가 다르게 나타나는 현상이다.",
    source: { name: "브리태니커 'Doppler effect' 항목", url: "https://www.britannica.com/science/Doppler-effect" }
  },
  {
    id: "sc-03", category: "과학",
    question: "다음 중 주기율표 18족 원소(비활성 기체)에 속하는 것은?",
    choices: ["수소", "질소", "염소", "아르곤"],
    answer: 3,
    explanation: "비활성 기체는 주기율표 18족을 이루는 원소들로 헬륨·네온·아르곤·크립톤·제논·라돈 등이 있으며, 수소·질소·염소는 여기에 속하지 않는다.",
    source: { name: "브리태니커 'noble gas' 항목", url: "https://www.britannica.com/science/noble-gas" }
  },
  {
    id: "sc-04", category: "과학",
    question: "물질의 양 1몰(mol)에 들어 있는 입자(원자·분자 등)의 수, 즉 아보가드로 수는 약 얼마인가?",
    choices: ["2.998×10⁸", "6.022×10²³", "6.626×10⁻³⁴", "1.602×10⁻¹⁹"],
    answer: 1,
    explanation: "SI에서 1몰은 정확히 6.022 140 76×10²³개의 기본 입자를 포함하며, 2.998×10⁸은 빛의 속력(m/s), 6.626×10⁻³⁴은 플랑크 상수(J·s), 1.602×10⁻¹⁹는 기본 전하(C)의 값이다.",
    source: { name: "NIST SP 330 (The International System of Units) 2절", url: "https://www.nist.gov/pml/special-publication-330/sp-330-section-2" }
  },
  {
    id: "sc-05", category: "과학",
    question: "세포의 생화학 반응에 필요한 화학 에너지의 대부분을 만들어 ATP(아데노신 삼인산) 형태로 저장하는 세포 소기관은?",
    choices: ["리보솜", "미토콘드리아", "골지체", "리소좀"],
    answer: 1,
    explanation: "미토콘드리아는 막으로 둘러싸인 세포 소기관으로, 세포의 생화학 반응에 필요한 화학 에너지의 대부분을 만들어 ATP라는 작은 분자에 저장한다.",
    source: { name: "미국 국립인간게놈연구소(NHGRI) 유전학 용어집 'Mitochondria'", url: "https://www.genome.gov/genetics-glossary/Mitochondria" }
  },
  {
    id: "sc-06", category: "과학",
    question: "DNA의 네 가지 염기 가운데, RNA에서는 대개 유라실(U)로 대체되는 염기는?",
    choices: ["아데닌(A)", "구아닌(G)", "사이토신(C)", "티민(T)"],
    answer: 3,
    explanation: "RNA의 네 염기는 유라실·아데닌·사이토신·구아닌이고, DNA에서는 유라실 대신 티민이 쓰인다.",
    source: { name: "미국 국립인간게놈연구소(NHGRI) 유전학 용어집 'Uracil'", url: "https://www.genome.gov/genetics-glossary/Uracil" }
  },
  {
    id: "sc-07", category: "과학",
    question: "혈액 속 포도당(혈당) 농도를 조절하는 호르몬인 인슐린을 만들어 분비하는 기관은?",
    choices: ["간", "이자(췌장)", "콩팥(신장)", "갑상샘"],
    answer: 1,
    explanation: "인슐린은 이자(췌장)의 랑게르한스섬 베타세포에서 만들어지며, 식사 뒤처럼 혈당이 오르면 분비된다.",
    source: { name: "브리태니커 'insulin' 항목", url: "https://www.britannica.com/science/insulin" }
  },
  {
    id: "sc-08", category: "과학",
    question: "지진이 시작된 땅속 지점의 바로 위에 해당하는 지표면의 지점을 이르는 말은?",
    choices: ["진원", "진앙", "단층면", "판 경계"],
    answer: 1,
    explanation: "지진이 시작되는 땅속 지점을 진원(hypocenter), 그 바로 위 지표면의 지점을 진앙(epicenter)이라고 한다.",
    source: { name: "미국 지질조사국(USGS) 'The Science of Earthquakes'", url: "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes" }
  },
  {
    id: "sc-09", category: "과학",
    question: "지구 대기 속 오존의 약 90%가 모여 있는, 고도 약 10~50km 사이의 대기층은?",
    choices: ["대류권", "성층권", "중간권", "열권"],
    answer: 1,
    explanation: "NASA에 따르면 대기 중 오존의 90%는 고도 약 10~50km 사이의 대기층인 성층권에 있다.",
    source: { name: "NASA Ozone Watch 'Ozone facts' (What is Ozone?)", url: "https://ozonewatch.gsfc.nasa.gov/facts/ozone_SH.html" }
  },
  {
    id: "sc-10", category: "과학",
    question: "태양 중심핵에서 일어나 태양의 열과 빛을 만들어 내는 반응은?",
    choices: ["우라늄 원자핵의 핵분열", "수소가 헬륨이 되는 핵융합", "탄소의 연소(산화)", "라듐의 방사성 붕괴"],
    answer: 1,
    explanation: "태양 중심핵은 약 1,500만 °C로 뜨거워서, 여기서 수소가 융합해 헬륨이 되는 핵반응이 태양의 열과 빛을 만든다.",
    source: { name: "NASA 'Sun: Facts'", url: "https://science.nasa.gov/sun/facts/" }
  },
  {
    id: "ac-01", category: "예술과 문화",
    question: "빈센트 반 고흐가 1889년 6월 프랑스 생레미의 요양원에 머물며 그린 「별이 빛나는 밤」을 소장한 미술관은?",
    choices: ["뉴욕 현대미술관(MoMA)", "암스테르담 반 고흐 미술관", "파리 루브르 박물관", "런던 내셔널 갤러리"],
    answer: 0,
    explanation: "「별이 빛나는 밤」은 반 고흐가 생레미의 생폴드모졸 요양원 창밖 풍경에서 영감을 받아 1889년 6월 중순에 그린 유화로, 뉴욕 현대미술관(MoMA)의 소장품이다.",
    source: { name: "뉴욕 현대미술관(MoMA) 소장품 'The Starry Night'", url: "https://www.moma.org/collection/works/79802" }
  },
  {
    id: "ac-02", category: "예술과 문화",
    question: "1874년 파리의 한 전시회에 출품되어 '인상주의(인상파)'라는 이름이 생겨나는 계기가 된 그림 「인상, 해돋이」를 그린 화가는?",
    choices: ["에두아르 마네", "클로드 모네", "폴 세잔", "오귀스트 르누아르"],
    answer: 1,
    explanation: "모네는 르아브르 항구의 새벽 풍경을 그린 이 그림에 「인상」이라는 제목을 붙여 1874년 전시회에 내놓았고, 비평가 루이 르루아가 이를 따서 기사 제목을 「인상주의자들의 전시회」라고 지었다.",
    source: { name: "마르모탕 모네 미술관 소장품 'Impression, soleil levant'", url: "https://www.marmottan.fr/en/notice/4014/" }
  },
  {
    id: "ac-03", category: "예술과 문화",
    question: "비가 갠 뒤의 인왕산 경치를 그린 국보 「인왕제색도」의 화가는?",
    choices: ["김홍도", "신윤복", "정선", "김정희"],
    answer: 2,
    explanation: "「인왕제색도」는 정선이 76세 때인 1751년에 비 온 뒤의 인왕산 경치를 보고 그린 수묵 산수화로, 국립중앙박물관이 소장하고 있다.",
    source: { name: "한국민족문화대백과사전 '정선 필 인왕제색도' 항목", url: "https://encykorea.aks.ac.kr/Article/E0046984" }
  },
  {
    id: "ac-04", category: "예술과 문화",
    question: "마지막 악장에서 독창자들과 합창단이 실러의 시 「환희의 송가(An die Freude)」를 노래하는 베토벤의 교향곡은?",
    choices: ["교향곡 제3번", "교향곡 제5번", "교향곡 제6번", "교향곡 제9번"],
    answer: 3,
    explanation: "베토벤의 마지막 완성 교향곡인 제9번은 마지막 악장에서 독창자들과 합창단이 실러의 시 「환희의 송가」를 노래하며, 1824년 빈에서 초연되었다.",
    source: { name: "브리태니커 'Symphony No. 9 in D Minor, Op. 125' 항목", url: "https://www.britannica.com/topic/Symphony-No-9-in-D-Minor" }
  },
  {
    id: "ac-05", category: "예술과 문화",
    question: "소리꾼 한 사람이 북을 치는 고수의 반주에 맞춰 노래와 말, 몸짓을 섞어 가며 긴 이야기를 들려주는 한국의 전통 공연 예술은?",
    choices: ["탈춤", "남사당놀이", "판소리", "종묘제례악"],
    answer: 2,
    explanation: "판소리는 소리꾼 한 명과 북 하나를 치는 고수가 함께하는 이야기 노래로, 공연이 8시간에 이르기도 하며 유네스코 인류무형문화유산 대표목록에 올라 있다.",
    source: { name: "유네스코 무형유산 'Pansori epic chant'", url: "https://ich.unesco.org/en/RL/pansori-epic-chant-00070" }
  },
  {
    id: "ac-06", category: "예술과 문화",
    question: "1780년 청나라 건륭제의 칠순 잔치를 축하하러 가는 사절단을 따라 열하까지 다녀온 뒤 견문록 『열하일기』를 쓴 인물은?",
    choices: ["박제가", "홍대용", "정약용", "박지원"],
    answer: 3,
    explanation: "『열하일기』는 실학자 박지원이 1780년 건륭제의 칠순연을 축하하러 가는 삼종형 박명원을 수행해 연경과 열하를 다녀온 뒤 쓴 견문록이다.",
    source: { name: "한국민족문화대백과사전 '열하일기' 항목", url: "https://encykorea.aks.ac.kr/Article/E0037072" }
  },
  {
    id: "ac-07", category: "예술과 문화",
    question: "기사 이야기에 빠진 시골 귀족이 스스로 기사가 되어 종자 산초 판사와 함께 모험을 떠나는 소설 『돈키호테』의 작가는?",
    choices: ["미겔 데 세르반테스", "로페 데 베가", "윌리엄 셰익스피어", "프랑수아 라블레"],
    answer: 0,
    explanation: "『돈키호테』는 에스파냐 작가 세르반테스가 1605년(1부)과 1615년(2부)에 펴낸 소설로, 당시 유행하던 기사 이야기를 풍자하려는 의도로 구상되었다.",
    source: { name: "브리태니커 'Don Quixote' 항목", url: "https://www.britannica.com/topic/Don-Quixote-novel" }
  },
  {
    id: "ac-08", category: "예술과 문화",
    question: "무굴 제국 황제 샤자한이 세상을 떠난 아내 뭄타즈 마할을 기리기 위해 인도 아그라에 지은 흰 대리석 무덤은?",
    choices: ["후마윤 묘", "타지마할", "아그라 성", "쿠트브 미나르"],
    answer: 1,
    explanation: "타지마할은 무굴 황제 샤자한이 아내 뭄타즈 마할을 기리기 위해 아그라에 짓게 한 거대한 흰 대리석 무덤이다.",
    source: { name: "유네스코 세계유산 'Taj Mahal'", url: "https://whc.unesco.org/en/list/252/" }
  },
  {
    id: "ac-09", category: "예술과 문화",
    question: "조선 태종의 명으로 15세기 초에 지어졌으며, 산자락의 지형을 살려 건물을 배치하고 북쪽에 넓은 후원(비원)을 둔 서울의 궁궐은?",
    choices: ["경복궁", "창덕궁", "덕수궁", "경희궁"],
    answer: 1,
    explanation: "창덕궁은 15세기 초 태종의 명으로 경복궁의 이궁으로 지은 궁궐로, 산자락의 지형에 맞춰 건물을 배치하고 북쪽에 후원(비원)을 두었다.",
    source: { name: "유네스코 세계유산 'Changdeokgung Palace Complex'", url: "https://whc.unesco.org/en/list/816/" }
  },
  {
    id: "ac-10", category: "예술과 문화",
    question: "몽골의 침입에 맞서 새긴 고려 대장경판(팔만대장경)을 보관하는 장경판전이 있는 사찰은?",
    choices: ["불국사", "통도사", "송광사", "해인사"],
    answer: 3,
    explanation: "가야산 해인사의 장경판전은 몽골의 침입에 맞서 1237~1248년에 새긴 약 8만 장의 대장경판을 보관하려고 15세기에 지은 건물이다.",
    source: { name: "유네스코 세계유산 'Haeinsa Temple Janggyeong Panjeon'", url: "https://whc.unesco.org/en/list/737/" }
  }
];
