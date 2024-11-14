import {
  Body,
  Link,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { PLATFORMS_LOGO } from "@/lib/constants";

export default function SiteInvite({
  email = "panicking@thedis.co",
  url = "http://app.localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com",
  siteName = "Acme",
  siteUser = "Brendon Urie",
  siteUserEmail = "panic@thedis.co",
}: {
  email: string;
  url: string;
  siteName: string;
  siteUser: string;
  siteUserEmail: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Join {siteName} on Platforms</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={PLATFORMS_LOGO}
                width="40"
                height="40"
                alt="Platforms"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Join {siteName} on Platforms
            </Heading>
            <Text className="text-sm leading-6 text-black">
              <strong>{siteUser}</strong> (
              <Link
                className="text-blue-600 no-underline"
                href={`mailto:${siteUserEmail}`}
              >
                {siteUserEmail}
              </Link>
              ) has invited you to join the <strong>{siteName}</strong>{" "}
              site on Platforms!
            </Text>
            <Section className="mb-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Join Site
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, "")}
            </Text>
            <Hr className="mx-0 my-6 w-full border border-gray-200" />
            <Text className="text-[12px] leading-6 text-gray-500">
              This invitation was intended for{" "}
              <span className="text-black">{email}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account's safety, please reply to this email
              to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
