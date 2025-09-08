import { skapi } from "@/main";
import { user } from "@/code/user";

type UpdateData = Record<string, any>;

class MiscUpdater {
    private queue: {
        updateData: UpdateData;
        resolve: (value: UpdateData | PromiseLike<UpdateData>) => void;
        reject: (reason?: any) => void;
    }[] = [];

    private processing = false;
    private currentMisc: UpdateData = {};

    public update(updateData: UpdateData): Promise<UpdateData> {
        return new Promise((resolve, reject) => {
            this.queue.push({ updateData, resolve, reject });
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.processing) return;
        if (this.queue.length === 0) return;

        this.processing = true;
        const { updateData, resolve, reject } = this.queue[0];

        try {
            // user.misc에서 직접 읽어오기
            this.currentMisc = user?.misc ? JSON.parse(user.misc) : {};

            // 새 데이터 병합
            this.currentMisc = { ...this.currentMisc, ...updateData };

            // 서버에 저장
            await skapi.updateProfile({
                misc: JSON.stringify(this.currentMisc),
            });

            resolve(this.currentMisc);
        } catch (err) {
            reject(err);
        } finally {
            this.queue.shift();
            this.processing = false;
            this.processQueue(); // 다음 실행
        }
    }
}

export const miscUpdater = new MiscUpdater();
