import "server-only";
import { headers } from "next/headers";
import { emailHtml, sendMail } from "./mailer";
import { SITE } from "./seo";

type L = "ar" | "en";
/** Links use the configured public URL in production; locally they follow the address you opened. */
async function origin() {
  if (process.env.NODE_ENV === "production") return SITE;
  const h = await headers();
  const host = h.get("host");
  return host ? `http://${host}` : SITE;
}

const COPY = {
  welcome: {
    ar: { subject: "أهلاً بك في IPMA السعودية", title: "أهلاً بك، {name}", lines: ["تم إنشاء حسابك في IPMA السعودية بنجاح.", "يمكنك الآن الدخول إلى ملفك الشخصي ومشاهدة الشارات التي يمنحها لك الفريق، وتحديث صورتك وبياناتك.", "تابع مواعيد الاختبارات وفعاليات ملتقى المشاريع على موقعنا."], button: "الدخول إلى ملفي", footer: "وصلتك هذه الرسالة لأنك أنشأت حساباً في IPMA السعودية. للاستفسار: care@ipmaksa.world" },
    en: { subject: "Welcome to IPMA KSA", title: "Welcome, {name}", lines: ["Your IPMA KSA account has been created.", "You can now open your profile, see the badges the team awards you, and update your photo and details.", "Follow exam dates and Project Connect events on our website."], button: "Open my profile", footer: "You received this because you created an account at IPMA KSA. Questions: care@ipmaksa.world" },
  },
  reset: {
    ar: { subject: "إعادة تعيين كلمة المرور", title: "إعادة تعيين كلمة المرور", lines: ["تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في IPMA السعودية.", "اضغط على الزر لاختيار كلمة مرور جديدة. الرابط صالح لمدة 30 دقيقة ويعمل مرة واحدة.", "إن لم تطلب ذلك فتجاهل هذه الرسالة، ولن يتغير شيء في حسابك."], button: "اختيار كلمة مرور جديدة", footer: "للاستفسار: care@ipmaksa.world" },
    en: { subject: "Reset your password", title: "Reset your password", lines: ["We received a request to reset the password of your IPMA KSA account.", "Press the button to choose a new password. The link is valid for 30 minutes and works once.", "If you did not ask for this, ignore this email. Nothing will change in your account."], button: "Choose a new password", footer: "Questions: care@ipmaksa.world" },
  },
  changed: {
    ar: { subject: "تم تغيير كلمة المرور", title: "تم تغيير كلمة المرور", lines: ["تم تغيير كلمة المرور لحسابك في IPMA السعودية قبل لحظات.", "إذا لم تكن أنت من قام بذلك فراسلنا فوراً على care@ipmaksa.world."], footer: "إشعار أمان من IPMA السعودية" },
    en: { subject: "Your password was changed", title: "Your password was changed", lines: ["The password of your IPMA KSA account was just changed.", "If this was not you, write to us right away at care@ipmaksa.world."], footer: "Security notice from IPMA KSA" },
  },
} as const;

async function send(kind: keyof typeof COPY, lang: L, to: string, name: string, path?: string) {
  const c = COPY[kind][lang] as { subject: string; title: string; lines: readonly string[]; button?: string; footer: string };
  const url = path ? `${await origin()}${path}` : "";
  const lines = [...c.lines];
  const title = c.title.replace("{name}", name);
  return sendMail({
    to,
    subject: c.subject,
    html: emailHtml({ lang, title, lines, footer: c.footer, button: url && c.button ? { label: c.button, url } : undefined }),
    text: `${title}\n\n${lines.join("\n\n")}${url ? `\n\n${url}` : ""}\n\n${c.footer}`,
  });
}

export const sendWelcome = (lang: L, to: string, name: string) => send("welcome", lang, to, name, `/${lang}/profile`);
export const sendReset = (lang: L, to: string, name: string, token: string) => send("reset", lang, to, name, `/${lang}/reset-password?token=${token}`);
export const sendPasswordChanged = (lang: L, to: string, name: string) => send("changed", lang, to, name);
