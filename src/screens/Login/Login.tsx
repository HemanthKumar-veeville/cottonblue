import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import vector from "../../../static/img/log.svg ";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-2/5 bg-[#07515f] flex-col items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="inline-flex flex-col items-center">
            <img className="" alt="Logo" src="/img/Logo_cb_svg.svg" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-3/5 bg-[#f9fafb] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bonjour !</h2>
            <p className="text-[#475569]">
              Bienvenue sur votre espace administrateur
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-[#cbd5e1] rounded-md"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                className="w-full p-3 border border-[#cbd5e1] rounded-md"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#07515f] hover:bg-[#07515f]/90 text-white py-3 rounded-md transition-colors"
            >
              Connexion
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
