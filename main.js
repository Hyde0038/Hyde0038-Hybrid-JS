window.addEventListener("DOMContentLoaded", () => {
    const cacheRef = "hyde0038-blob";
    const main = document.querySelector("body");

    async function fetchAndCacheImage(url = "https://picsum.photos/v2/list") {
        try {
            const cache = await caches.open(cacheRef);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error with the fetch");
            }
            const dataResponse = await response.json();

            for (const blobData of dataResponse) {
                try {
                    const blobResponse = await fetch(blobData.download_url);
                    if (!blobResponse.ok) {
                        throw new Error("Issues getting the blob url");
                    }

                    const blob = await blobResponse.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const img = document.createElement("img");
                    img.src = blobUrl;
                    main.append(img);

                    console.log(`Cached Image ${blobUrl}`);
                    await cache.put(blobData.download_url, new Response(blob));
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (blobErr) {
            console.log("There was an error ", blobErr);
        }
    }

    async function getImage(blobUrl) {
        try {
            const cache = await caches.open(cacheRef);
            const keys = await cache.keys();

            if (keys.length > 0) {
                keys.forEach((key) => {
                    if (cache.match(key)) {
                        console.log(`URL in Cache: ${key.url}`);

                        let img = document.createElement("img");
                        img.src = key.url;
                        main.append(img);
                    }
                });
            } else {
                await fetchAndCacheImage();
            }
        } catch (err) {
            console.error("Issues retrieving cache", err);
        }
    }

    //I admit defeat here, I'm unsure how to do the expiry date but I will study it further

    getImage();
});
