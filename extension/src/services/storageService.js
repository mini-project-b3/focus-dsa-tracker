export const saveData = async (key,value)=>{

    await chrome.storage.local.set({
        [key]:value
    });
};

export const getData = async (key)=>{

    const result =
    await chrome.storage.local.get(key);

    return result[key];
};