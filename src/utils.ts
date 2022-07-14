export function approxEquals(a: number, b: number, threshold=0.01) {

  if (Math.abs( a - b ) < threshold) {
    return true;
  }
  return false;

}