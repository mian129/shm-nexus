import { NextResponse } from "next/server";
import { deleteMany, createOne, findOne } from "@/lib/mongodb-api";
import { teamPhotos } from "@/lib/team-photos";

const teamMembers = [
  {
    name: "Muhammad Muneeb",
    designation: "CEO & Founder, SEO Specialist",
    bio: "Visionary leader and SEO specialist with a passion for driving digital growth. Muhammad founded SHM Nexus with the mission to help businesses thrive online through data-driven strategies and innovative solutions. His expertise in search engine optimization has helped countless brands achieve top rankings and sustainable organic growth.",
    photo: teamPhotos.muneeb,
    order: 1,
    socialLinks: { linkedin: "", twitter: "", instagram: "" },
  },
  {
    name: "Hanan Mehmood",
    designation: "Co-Founder, HR & Lead Generation Expert",
    bio: "Strategic mind behind SHM Nexus's lead generation engine. Hanan specializes in identifying high-value opportunities and building systems that consistently deliver quality leads. His deep understanding of market dynamics and customer behavior helps clients achieve measurable ROI across all campaigns.",
    photo: teamPhotos.hanan,
    order: 2,
    socialLinks: { linkedin: "", twitter: "", instagram: "" },
  },
  {
    name: "Subhan Ali",
    designation: "Co-Founder, Web Developer & Python Expert",
    bio: "Full-stack developer and Python expert who brings ideas to life through clean, efficient code. Subhan architects and builds scalable web applications that power SHM Nexus's client projects. His technical expertise spans modern frameworks, API integrations, and automation solutions.",
    photo: teamPhotos.subhan,
    order: 3,
    socialLinks: { linkedin: "", twitter: "", instagram: "" },
  },
  {
    name: "Hussnain Amir",
    designation: "Co-Founder, Digital Marketing Head & Creative Head",
    bio: "Creative strategist with an eye for compelling campaigns. Hussnain leads SHM Nexus's digital marketing efforts, blending data analytics with creative storytelling. His expertise in social media, paid advertising, and brand development helps businesses build powerful online presence.",
    photo: teamPhotos.hussnain,
    order: 4,
    socialLinks: { linkedin: "", twitter: "", instagram: "" },
  },
];

export async function POST() {
  try {
    await deleteMany("teams", {});
    for (const member of teamMembers) {
      await createOne("teams", member);
    }

    return NextResponse.json({
      message: "Team seeded successfully",
      count: teamMembers.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let seeded = 0;
    for (const member of teamMembers) {
      const exists = await findOne("teams", { name: member.name });
      if (!exists) {
        await createOne("teams", member);
        seeded++;
      }
    }

    return NextResponse.json({
      message: seeded > 0 ? `Seeded ${seeded} new members` : "All team members already exist",
      seeded,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
