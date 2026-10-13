/**
 * 只做一句话说明的次要项目，以及我在关注的第三方项目。
 * 这些不单独建页，避免为一句话的内容造一个空页面。
 */
export type OtherProject = {
  name: string;
  desc: { zh: string; en: string };
  href?: string;
  /** 备注，例如「fork / 关注」 */
  tag?: { zh: string; en: string };
};

export const otherProjects: OtherProject[] = [
  {
    name: 'Nexmark',
    desc: {
      zh: '为 WM 构建的 SaaS 营销系统：Spring Boot 2.6 + PostgreSQL + MyBatis-Plus + Druid 的服务端，含 BCrypt 加密与完整 DDL 脚本，配独立门户前端。',
      en: 'A SaaS marketing system built for WM: Spring Boot 2.6 + PostgreSQL + MyBatis-Plus + Druid server with BCrypt hashing and full DDL scripts, plus a separate portal frontend.',
    },
    href: 'https://github.com/archibald-nice/nexmark-server',
  },
  {
    name: 'Mind Card',
    desc: {
      zh: 'Umi Max 前端 + Java 服务端的双端结构，练手全栈链路的项目。',
      en: 'Umi Max frontend with a Java server — a full-stack exercise across the whole chain.',
    },
    href: 'https://github.com/archibald-nice/mind-card',
  },
  {
    name: 'Xmoment Office',
    desc: {
      zh: 'React + Vite 的门户前端。仓库里填的 Vercel 演示地址已经 404，暂时只留源码。',
      en: 'A React + Vite portal frontend. The Vercel demo URL recorded on the repo now 404s, so only the source remains.',
    },
    href: 'https://github.com/archibald-nice/xmoment-office-frontend',
  },
];

/** 我持续关注、会读代码的第三方项目 */
export const followedProjects: OtherProject[] = [
  {
    name: 'codeg',
    desc: {
      zh: '把 Claude Code、Codex、OpenCode 等多路 AI 编码会话聚合成一个工作区，Rust 实现，桌面端 + 自托管服务端 + Docker 三种形态。我 fork 了它用来跟读多 Agent 协作的设计。',
      en: 'Aggregates AI coding sessions from Claude Code, Codex, OpenCode and others into one workspace. Rust, shipping as desktop app, self-hosted server or Docker. I forked it to follow the multi-agent collaboration design.',
    },
    href: 'https://github.com/archibald-nice/codeg',
    tag: { zh: 'fork', en: 'fork' },
  },
  {
    name: 'Snapzy',
    desc: {
      zh: '原生 macOS 截图与录屏应用，CleanShot X 的开源替代，Swift 写。跟着看原生 UI 的实现方式。',
      en: 'A native macOS screenshot and screen-recording app, an open-source CleanShot X alternative written in Swift. I follow it for how native UI gets built.',
    },
    href: 'https://github.com/archibald-nice/Snapzy',
    tag: { zh: 'fork', en: 'fork' },
  },
];
