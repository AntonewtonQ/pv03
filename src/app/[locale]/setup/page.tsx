import PageFrame from "@/components/page-frame";

const SetupPage = () => {
  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="border-y border-white/10 py-12">
          <p className="text-sm uppercase text-emerald-300">Setup</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Workspace
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Uma página reservada para ferramentas, stack e ambiente de trabalho.
          </p>
        </div>
      </section>
    </PageFrame>
  );
};

export default SetupPage;
