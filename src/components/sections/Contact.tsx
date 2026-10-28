"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/portfolio";
import { Magnetic } from "@/components/ui/Magnetic";
import { FadeUp, MaskText } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";
import { BrandMark } from "@/components/Nav";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (data.name.trim().length < 2) e.name = "Please tell me your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = "That email doesn't look right.";
  if (data.message.trim().length < 10) e.message = "A little more detail, please (10+ characters).";
  return e;
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Fallback for browsers without async clipboard permission
      const ta = document.createElement("textarea");
      ta.value = profile.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="label-mono inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 transition-colors hover:border-lime hover:text-lime"
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <Check size={14} className="text-lime" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </AnimatePresence>
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company_website")) return; // honeypot
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    if (!FORMSPREE_ID) {
      // No form service configured: hand off to the visitor's email app, pre-filled.
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field =
    "peer w-full border-0 border-b border-line-strong bg-transparent px-0 pb-3 pt-6 text-lg text-paper placeholder-transparent outline-none transition-colors focus:border-lime";
  const label =
    "label-mono pointer-events-none absolute left-0 top-0 text-dim transition-colors peer-focus:text-lime";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8" aria-describedby="form-note">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-8 sm:grid-cols-2">
        {(["name", "email"] as const).map((n) => (
          <div key={n} className="relative">
            <input
              id={`f-${n}`}
              name={n}
              type={n === "email" ? "email" : "text"}
              autoComplete={n === "email" ? "email" : "name"}
              placeholder={n}
              aria-invalid={!!errors[n]}
              aria-describedby={errors[n] ? `f-${n}-err` : undefined}
              className={field}
            />
            <label htmlFor={`f-${n}`} className={label}>
              {n === "name" ? "Your name" : "Your email"}
            </label>
            {errors[n] ? (
              <p id={`f-${n}-err`} className="mt-2 text-sm text-[#ff8a7a]">
                {errors[n]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <div className="relative">
        <textarea
          id="f-message"
          name="message"
          rows={4}
          placeholder="message"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "f-message-err" : undefined}
          className={`${field} resize-none`}
        />
        <label htmlFor="f-message" className={label}>
          What are we building?
        </label>
        {errors.message ? (
          <p id="f-message-err" className="mt-2 text-sm text-[#ff8a7a]">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-lime px-7 py-4 font-semibold text-ink transition-transform active:scale-95 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : FORMSPREE_ID ? "Send message" : "Compose email"}
          <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        <p id="form-note" className="label-mono normal-case tracking-normal text-dim">
          {FORMSPREE_ID
            ? "Sent securely via Formspree."
            : "Opens your email app with this message filled in."}
        </p>
      </div>

      <div role="status" aria-live="polite">
        {status === "sent" ? (
          <p className="rounded-2xl border border-lime/40 bg-lime/10 p-4 text-lime">Thanks — your message is in. I&apos;ll reply soon.</p>
        ) : status === "error" ? (
          <p className="rounded-2xl border border-[#ff8a7a]/40 bg-[#ff8a7a]/10 p-4 text-[#ffb3a8]">
            Something went wrong sending that. Please email me directly at {profile.email}.
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-[var(--section-y)]">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-lime/[0.06] blur-3xl" />
      <div className="container-x relative">
        <div className="label-mono flex items-center gap-4 text-muted">
          <span className="text-lime">07</span> Contact <span className="h-px flex-1 bg-line-strong" />
        </div>

        <h2 id="contact-title" className="display-xl mt-10 uppercase">
          <MaskText text="Let's build" />
          <br />
          <MaskText text="something" delay={0.1} className="serif-accent normal-case text-lime" />{" "}
          <MaskText text="real." delay={0.2} />
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-24">
          <FadeUp className="col-span-12 lg:col-span-5">
            <p className="max-w-[38ch] text-xl leading-snug text-paper/80">
              Hiring for a full stack role, or need someone to take a product from Figma to production? I&apos;d like to hear about it.
            </p>

            <div className="mt-10 border-t border-line pt-6">
              <div className="label-mono text-dim">Email</div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative break-all text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  {profile.email}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
                </a>
                <CopyEmail />
              </div>
            </div>

            <ul className="mt-8 grid gap-0 border-t border-line">
              {profile.showPhone && profile.phone ? (
                <li className="border-b border-line">
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="group flex min-h-14 items-center justify-between py-4">
                    <span className="flex items-center gap-3">
                      <Phone size={16} className="text-dim" /> {profile.phone}
                    </span>
                    <span className="label-mono text-dim group-hover:text-lime">Call</span>
                  </a>
                </li>
              ) : null}
              {profile.socials.map((s) => (
                <li key={s.label} className="border-b border-line">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center justify-between py-4">
                    <span className="flex items-center gap-3">
                      <span className="label-mono w-20 text-dim">{s.label}</span>
                      <span className="truncate">{s.handle}</span>
                    </span>
                    <ArrowUpRight size={18} className="text-dim transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li className="border-b border-line">
                <a href={`mailto:${profile.email}`} className="group flex min-h-14 items-center justify-between py-4">
                  <span className="flex items-center gap-3">
                    <Mail size={16} className="text-dim" /> Write directly
                  </span>
                  <span className="label-mono text-dim group-hover:text-lime">Mail</span>
                </a>
              </li>
            </ul>
          </FadeUp>

          <FadeUp delay={0.1} className="col-span-12 rounded-[28px] border border-line bg-ink-2/80 p-6 backdrop-blur md:p-10 lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </FadeUp>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="container-x mt-32 border-t border-line py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <BrandMark size={40} />
          <div>
            <div className="font-semibold">{profile.name}</div>
            <div className="label-mono text-dim">{profile.role} · {profile.location.split(",")[0]}</div>
          </div>
        </div>
        <p className="label-mono text-dim">Built with Next.js · TypeScript · Tailwind CSS · Motion</p>
        <Magnetic>
          <a
            href="#top"
            className="label-mono group inline-flex min-h-11 items-center gap-3 rounded-full border border-line-strong px-5 transition-colors hover:border-lime hover:text-lime"
          >
            Back to top
            <motion.span className="inline-block" whileHover={{ y: -3 }} transition={{ ease: ease.out }}>
              <ArrowUp size={14} />
            </motion.span>
          </a>
        </Magnetic>
      </div>
      <p className="label-mono mt-8 text-dim/70">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
    </footer>
  );
}
