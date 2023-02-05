class FoodoraNotify {
    constructor(target) {
        this.observer = new MutationObserver(() => this.notify());

        this.eta = target.querySelector(".order-eta-range-caption");

        // Send ETA update notification each time the ETA text updates on screen
        this.observer.observe(this.eta, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    // Send ETA update notification via service worker
    notify() {
        chrome.runtime.sendMessage({
            title: this.eta.innerText,
            msg: "Foodora ETA",
            icon: "/assets/media/icon.webp"
        });
    }
}

// Get the Foodora order status box from the interface and initialize FoodoraNotify with it.
// We can't just get the element immedately after the "load" event fires as this element is loaded in with async JS.
window.addEventListener("load", async () => {
    // Stop polling after 10 seconds
    const timeout = new Promise((resolve, reject) => setTimeout(() => reject("timeout"), 10000));

    // Poll the DOM for existance of Foodora order status box so we can watch it for mutations later
    const target = () => new Promise((resolve, reject) => {
        const className = "new-order-status-box";

        // Found the element?
        (function pollTarget() {
            // Found it, return it and stop polling
            if (document.getElementsByClassName(className)[0] instanceof HTMLElement) {
                resolve(document.getElementsByClassName(className)[0]);
            }

            // Not yet, poll again in 1 second
            setTimeout(pollTarget, 1000);
        })();
    });

    try {
        // Initialize the Foodora notify class with the status box element from the page
        new FoodoraNotify(await Promise.race([target(), timeout]));
    } catch(e) {
        alert("Foodora Notify\n\nNågot gick fel. Försök ladda om sidan\n\nSomething went wrong. Please try to reload the page");
    }

}, { once: true });