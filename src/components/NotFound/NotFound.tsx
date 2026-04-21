import { useNavigate } from "react-router-dom";
import type { NotFoundProps } from "./NotFound.types";
import "./NotFound.scss";

const NotFound = ({ message }: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="not-found" role="status" aria-label="Página no encontrada">
      <span className="not-found__code" aria-hidden="true">
        404
      </span>

      <h1 className="not-found__title">País no encontrado</h1>

      <p className="not-found__message">
        {message ??
          "El país que buscas no existe o aún no está disponible en Combat Atlas."}
      </p>

      <button className="not-found__button" onClick={() => navigate("/")}>
        ← Mapa Mundial
      </button>
    </div>
  );
};

export default NotFound;
