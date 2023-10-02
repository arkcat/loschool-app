
export default async function Index() {
  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <div>
          <h2 className="text-lg font-bold text-center">
            스케쥴
          </h2>
          <div className="grid">
            <div className='checkbox'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
