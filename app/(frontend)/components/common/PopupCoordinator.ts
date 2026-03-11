class PopupCoordinator {
    private queue: { id: string; showFn: () => void }[] = [];
    private isFree: boolean = true;
    private timer: NodeJS.Timeout | null = null;

    requestShow(id: string, showFn: () => void) {
        this.queue.push({ id, showFn });
        this.processQueue();
    }

    popupClosed(id: string) {
        this.isFree = false;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.isFree = true;
            this.processQueue();
        }, 5000); // 5 seconds gap
    }

    private processQueue() {
        if (this.isFree && this.queue.length > 0) {
            const next = this.queue.shift();
            this.isFree = false;
            if (next) next.showFn();
        }
    }
}

export const popupCoordinator = new PopupCoordinator();
