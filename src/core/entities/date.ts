export class DateFormat
{
  public date: Date;

	constructor(date?: Date)
  {
		this.date = date ?? new Date();
	}

  currentDate()
  {
    const day = String(this.date.getDate()).padStart(2, '0');
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    const year = this.date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  currentTime()
  {
    const hours = this.date.getHours() % 12 || 12;
    const minutes = String(this.date.getMinutes()).padStart(2, '0');
    const amPm = this.date.getHours() >= 12 ? 'PM' : 'AM';

    const formattedHours = String(hours).padStart(2, '0');

    return `${formattedHours}:${minutes} ${amPm}`;
  }

  currentDateTime()
  {
    return `${this.currentDate()} ${this.currentTime()}`;
  }

  limitTime()
  {
    return (new Date().getTime() - this.date.getTime()) / 60000 < 15;
  }
}
