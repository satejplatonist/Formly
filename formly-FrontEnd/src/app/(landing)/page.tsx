import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


export default function LandingPage() 
{
    return(
        <div className="min-h-screen w-full bg-slate-50 ">
            
        <section className="flex flex-col items-center justify-center p-8">

            <div className="max-w-screen-xl mx-auto px-6 sm:px-12 lg:px-24 py-16">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.2] text-center">
                <span className="bg-gradient-to-r text-transparent bg-clip-text from-emerald-500 to-emerald-700/75">
                Formly
                </span>
                {" – "}Build forms like{" "}
                <span className="relative inline-block">
                <span>Notion</span>
                <svg
                    className="absolute -bottom-2 left-0 h-3 w-full text-emerald-600"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M2 10C20 3 40 1 60 3C80 5 90 8 98 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    />
                </svg>
                </span>
                {" "}with drag and drop 
                <span className="block leading-none">magic</span>
            </h1>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 mt-8">
            <p className="mt-[-2.5rem] max-w-2xl text-xl text-center leading-8 text-zinc-800/75">
                Formly lets you create beautiful, interactive forms in minutes. 
                No coding required. Just drag, drop, and deploy.
                Experience the simplicity of Notion meets the power of advanced form building.
            </p>
            
            <Button className="sm:text-lg lg:text-xl py-2 px-6 font-semibold lg:h-12" size={"lg"}>
                Start Building Free
                <span><ArrowRight className="text-emerald-50 size-5"/></span>
            </Button>
            </div>


        </section>
        <section>

        </section>
        </div>
    );
}