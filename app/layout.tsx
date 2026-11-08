import '@/app/main.css'
import '@/app/globals.css'
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en">
      <body>{children}</body>
    </html>
  );
}
