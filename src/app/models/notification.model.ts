// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Utilities } from '@app/services';


export class Notification {

    public id: number;
    public header: string;
    public body: string;
    public isRead: boolean;
    public isPinned: boolean;
    public date: Date;
    public static Create(data: {}) {
        const n = new Notification();
        Object.assign(n, data);

        if (n.date) {
            n.date = Utilities.parseDate(n.date);
        }

        return n;
    }
}
