import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import type {
  FeedbackModalProps,
  FeedbackVariant,
  VariantStyles,
} from "./FeedbackModal.types";

const VARIANT_STYLES: Record<FeedbackVariant, VariantStyles> = {
  success: {
    borderGradient:
      "linear-gradient(135deg, #26c954 0%, #0e7a26 50%, #26c954 100%)",
    iconColor: "#26c954",
    glow: "0 0 60px rgba(38, 201, 84, 0.35), 0 20px 60px rgba(0, 0, 0, 0.6)",
    icon: faCheckCircle,
    buttonBg: "#26c954",
    buttonBgHover: "#1fa043",
  },
  error: {
    borderGradient:
      "linear-gradient(135deg, #ff4d4d 0%, #7a0606 50%, #ff4d4d 100%)",
    iconColor: "#ff4d4d",
    glow: "0 0 60px rgba(255, 77, 77, 0.35), 0 20px 60px rgba(0, 0, 0, 0.6)",
    icon: faTimesCircle,
    buttonBg: "#ff4d4d",
    buttonBgHover: "#d93838",
  },
};

const FeedbackModal = ({
  open,
  variant,
  title,
  message,
  confirmLabel = "Aceptar",
  onClose,
}: FeedbackModalProps) => {
  const [shouldRender, setShouldRender] = useState(open);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) setShouldRender(true);
  }, [open]);

  const handleExitComplete = () => {
    if (!open) setShouldRender(false);
  };

  const styles = VARIANT_STYLES[variant];

  const cardInitial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.6, y: 20 };
  const cardAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, y: 0 };
  const cardExit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.8 };
  const cardTransition = shouldReduceMotion
    ? { duration: 0.2 }
    : { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] as const };

  const shakeAnimate =
    variant === "error" && !shouldReduceMotion
      ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
      : { x: 0 };
  const shakeTransition =
    variant === "error" && !shouldReduceMotion
      ? { duration: 0.5, delay: 0.4, ease: "easeInOut" as const }
      : { duration: 0 };

  const iconAnimate = shouldReduceMotion
    ? { scale: 1 }
    : { scale: [1, 1.15, 1] };
  const iconTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 0.5,
      };

  return (
    <Modal
      open={shouldRender}
      onClose={onClose}
      aria-labelledby="feedback-modal-title"
      aria-describedby={message ? "feedback-modal-description" : undefined}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          outline: "none",
        }}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {open && (
            <motion.div
              key="feedback-card"
              initial={cardInitial}
              animate={cardAnimate}
              exit={cardExit}
              transition={cardTransition}
              style={{
                outline: "none",
                maxWidth: "100%",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              <motion.div
                animate={shakeAnimate}
                transition={shakeTransition}
                style={{ willChange: "transform" }}
              >
                <Box
                  sx={{
                    p: "2px",
                    borderRadius: 3,
                    background: styles.borderGradient,
                    boxShadow: styles.glow,
                    maxWidth: 440,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      bgcolor: "#0b0b0f",
                      borderRadius: "10px",
                      px: { xs: 3, sm: 5 },
                      py: { xs: 4, sm: 5 },
                      textAlign: "center",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: `radial-gradient(ellipse at top, ${styles.iconColor}33 0%, transparent 70%)`,
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <motion.div
                      animate={iconAnimate}
                      transition={iconTransition}
                      style={{
                        display: "inline-flex",
                        marginBottom: 16,
                        filter: `drop-shadow(0 0 18px ${styles.iconColor})`,
                        position: "relative",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={styles.icon}
                        style={{
                          color: styles.iconColor,
                          fontSize: "3.5rem",
                        }}
                      />
                    </motion.div>
                    <Typography
                      id="feedback-modal-title"
                      variant="h5"
                      sx={{
                        color: "#f5f5f7",
                        fontWeight: 800,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        mb: message ? 1.5 : 3,
                        position: "relative",
                      }}
                    >
                      {title}
                    </Typography>
                    {message && (
                      <Typography
                        id="feedback-modal-description"
                        sx={{
                          color: "rgba(245, 245, 247, 0.7)",
                          mb: 3,
                          position: "relative",
                        }}
                      >
                        {message}
                      </Typography>
                    )}
                    <Button
                      onClick={onClose}
                      variant="contained"
                      disableElevation
                      sx={{
                        minWidth: 140,
                        bgcolor: styles.buttonBg,
                        color: "#0b0b0f",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        borderRadius: 2,
                        py: 1.2,
                        position: "relative",
                        "&:hover": { bgcolor: styles.buttonBgHover },
                      }}
                    >
                      {confirmLabel}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
