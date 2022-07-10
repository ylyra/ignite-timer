import { HeaderContainer } from "./styles";

import logoSvg from "../../assets/logo-ignite.svg";
import { NavLink } from "react-router-dom";
import { Scroll, Timer } from "phosphor-react";

export function Header() {
  return (
    <HeaderContainer>
      <img
        src={logoSvg}
        alt="Two triangule pointing to right side up in green color"
        loading="lazy"
      />

      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="History">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
