export class RandomNumber
{
  public length: number = 7;
	public value: string;

	toString()
  {
		return this.value;
	}

  generateRandomNumber(length?: number)
  {
    const size = (length ?? this.length) - 1;
    const n = Math.pow(10, size);

    return Math.floor(n + Math.random() * n * 9).toString();
  }

	constructor(length?: number)
  {
		this.value = this.generateRandomNumber(length);
	}
}
