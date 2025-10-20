import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <Header />
        </div>
      </div>
      <div className="max-w-4xl mx-auto">{children}</div>
    </main>
  );
};

export default Layout;
