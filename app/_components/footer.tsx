// Estende o fundo do rodapé e alinha o texto ao container do site.
const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-secondary">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6">
        <p className="text-gray-400 text-xs font-bold opacity-75">
          © {new Date().getFullYear()} Copyright DD Barber Hub
        </p>
      </div>
    </footer>
  );
};

export default Footer;
