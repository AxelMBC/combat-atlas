import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";
import type { NotFoundProps } from "./NotFound.types";
import "./NotFound.scss";

const NotFound = ({ messageKey }: NotFoundProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="not-found" role="status" aria-label={t("notFound.aria")}>
      <span className="not-found__code" aria-hidden="true">
        404
      </span>

      <h1 className="not-found__title">{t("notFound.title")}</h1>

      <p className="not-found__message">
        {messageKey ? t(messageKey) : t("notFound.defaultMessage")}
      </p>

      <button className="not-found__button" onClick={() => navigate("/")}>
        {t("nav.backToWorldMap")}
      </button>
    </div>
  );
};

export default NotFound;
