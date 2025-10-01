// 회원가입된 계정 수에 따라 일련번호 생성
export const generateUniqueSerialIds = (accounts) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const generated = new Set();

  // 계정 수만큼 일련번호 생성
  const count = accounts.length;

  // 최대 가능한 조합 수 계산
  const totalCombinations = 26 * 26 * 9000;
  
  if (count > totalCombinations) {
    throw new Error(`일련번호를 생성할 수 없습니다. 최대 생성 가능한 수: ${totalCombinations}`);
  }

  // 랜덤 알파벳 2자리 생성
  const getRandomLetters = () =>
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));

  // 랜덤 숫자 4자리 생성
  const getRandomNumbers = () =>
    String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');

  // 계정 수만큼 고유한 일련번호 생성
  while (generated.size < count) {
    const serial = getRandomLetters() + getRandomNumbers();
    generated.add(serial);
  }

  return Array.from(generated);
}; 