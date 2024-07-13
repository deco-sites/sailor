import { useScript } from "deco/hooks/useScript.ts";

const onLoad = () => {
    // me when bottom scroller lmao
    const chatContainer = document.getElementById("chatContainer");

    if (chatContainer) {
        const observer = new MutationObserver(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
};

export const Chat = () => {
    return (
        <>
            <script
                type="module"
                defer
                dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
            />
            <div class="flex justify-center w-full flex-row w-full h-[50dvh]">
                <div
                    id="chatContainer"
                    class="flex w-full p-4 max-w-[1032px] bg-slate-200 overflow-y-scroll"
                >
                    <ul
                        id="chat"
                        class="w-full"
                        hx-swap="beforeend"
                        hx-swap-oob="beforeend"
                    >
                    </ul>
                </div>
            </div>
        </>
    );
};
