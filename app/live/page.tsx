import LiveView from "./components/live-view";

export default async function Deck() {

    return (
        <main className="flex flex-col items-center justify-center p-24 gap-20">
            <h1 className="text-stone-800 text-4xl">Live session</h1>
            <LiveView/>
        </main>
    );
}
