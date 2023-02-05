// Dispatch notification
chrome.runtime.onMessage.addListener(event => chrome.notifications.create(null, {
    type: "basic",
    title: event.title,
    message: event.msg,
    iconUrl: event.icon
}));