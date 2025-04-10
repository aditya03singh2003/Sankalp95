export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2023 Sankalp95 Coaching. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}
