export async function saveData(key, value) {

    await chrome.storage.local.set({
        [key]: value
    });
}

export async function getData(key) {

    const result =
        await chrome.storage.local.get(key);

    return result[key];
}

export async function removeData(key) {

    await chrome.storage.local.remove(key);
}

export async function clearData() {

    await chrome.storage.local.clear();
}