import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const quotes = [
  { text: '오늘 하루도 감사합니다.', author: null, source: null },
  { text: '행복은 습관이다. 그것을 몸에 지니라.', author: '허버드', source: null },
  { text: '천 리 길도 한 걸음부터.', author: null, source: '노자' },
  { text: '삶이 있는 한 희망은 있다.', author: '키케로', source: null },
  { text: '오늘 할 수 있는 일을 내일로 미루지 마라.', author: '벤저민 프랭클린', source: null },
  { text: '작은 기회로부터 종종 위대한 업적이 시작된다.', author: '데모스테네스', source: null },
  { text: '배움에는 끝이 없다.', author: null, source: null },
  { text: '실패는 성공의 어머니이다.', author: null, source: null },
  { text: '자신을 믿어라. 당신은 생각보다 강하다.', author: null, source: null },
  { text: '매일 조금씩 나아지면 된다.', author: null, source: null },
  { text: '감사할 줄 아는 사람이 더 많은 것을 얻는다.', author: null, source: null },
  { text: '지금 이 순간이 가장 소중하다.', author: null, source: null },
  { text: '꿈을 꾸는 것만으로도 이미 한 발 앞서 있다.', author: null, source: null },
  { text: '좋은 습관이 좋은 인생을 만든다.', author: null, source: null },
  { text: '웃음은 가장 좋은 약이다.', author: null, source: null },
];

async function main() {
  console.log('Seeding quotes...');

  for (const quote of quotes) {
    await prisma.quote.create({ data: quote });
  }

  console.log(`Seeded ${quotes.length} quotes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
