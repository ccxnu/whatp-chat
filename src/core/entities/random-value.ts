import { randomFillSync } from 'node:crypto';

export class RandomPassword
{
  public length: number = 8;
  public characters: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$';

	public value: string;

	toString()
  {
		return this.value;
	}

  generatePassword(length?: number)
  {
    const lg = length ?? this.length;

    return Array.from(randomFillSync(new Uint32Array(lg)))
      .map((x) => this.characters[x % this.characters.length])
      .join('')
  }

	constructor(length?: number)
  {
		this.value = this.generatePassword(length);
	}
}
