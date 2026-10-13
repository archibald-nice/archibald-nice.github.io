/**
 * 双语 UI 文案。所有页面级字符串都从这里取，避免散落在模板里。
 */
export const languages = { zh: '中文', en: 'English' } as const;
export type Lang = keyof typeof languages;

export const ui = {
  zh: {
    htmlLang: 'zh-CN',
    meta: {
      title: '大梁 (Archibald) — 全栈 / AI Native 工程师',
      description:
        '大梁（Archibald），六年全栈工程师，现在专注 AI Native：模型发布追踪、Agent 工具链、RAG 与数据管道。',
    },
    nav: { work: '作品', about: '关于', writing: '博客', contact: '联系' },
    themeToggle: '切换亮/暗主题',
    langSwitch: 'Switch to English',
    langSwitchLabel: 'EN',
    skipToContent: '跳到主要内容',

    hero: {
      h1: '大梁',
      latin: 'Archibald',
      role: '全栈开发 · ',
      roleStrong: 'AI Native',
      roleTail: ' · 6 年',
      lede: [
        '我写后端，也写前端，现在大部分时间花在让 LLM 真的把活干完这件事上。',
        '六年全栈：Java / Spring 服务端、PostgreSQL 与数据管道，React / TypeScript 交互界面。近两年重心转向 AI Native —— 模型发布追踪、Agent 工具链、RAG，以及把「AI 能干活」真正落到工程里。',
      ],
      slogan: '技术的洛希极限时代',
      sloganEn: 'The Roche-limit era of technology',
      ctaWork: '看作品',
      ctaMail: '写邮件',
    },

    sections: {
      work: '精选作品',
      workNote: '开源项目',
      minor: '其他项目',
      ability: '我在做什么',
      writing: '写作',
      writingNote: '全部文章',
      contact: '联系',
    },

    blog: {
      title: '博客',
      lede: '记录工程上的取舍、踩过的坑，以及一些还没想清楚的想法。',
      latest: '最新文章',
      allPosts: '全部文章',
      byYear: '按年份',
      tagsTitle: '标签',
      tagPageTitle: '标签',
      tagPrefix: '标签：',
      empty: '还没有文章。第一篇正在路上。',
      backToBlog: '← 回到文章列表',
      publishedOn: '发布于',
      updatedOn: '更新于',
      rss: 'RSS 订阅',
      readMore: '阅读全文',
      countUnit: ' 篇',
      legacyTitle: '更早的归档',
      legacyNote:
        '2025-08 之前写在 Hexo 上的随笔和笔记，没有迁移过来，链接保持原始路径。',
      legacyLink: '浏览归档',
      adminHint: '内容后台',
      totalPrefix: '共 ',
      countUnitOne: ' 篇',
    },

    work: {
      stackLabel: '技术栈',
      repo: '源码',
      details: '详情',
      readMore: '查看详情',
      backToWork: '← 回到作品列表',
      role: '角色',
      period: '时间',
      viewRepo: '在 GitHub 上看源码',
    },

    ability: [
      {
        area: 'AI Native 应用',
        desc: 'LLM 应用设计、多源数据交叉验证、Agent 工具链、RAG 与提示工程；把「能跑通」推进到「敢上线」。',
        chips: ['LLM', 'DeepSeek', 'LangChain 生态', 'RAG', 'Agent'],
      },
      {
        area: '后端与数据',
        desc: '服务端接口、数据管道与缓存层设计；静态代码分析、血缘图谱这类需要啃数据的活。',
        chips: ['Java', 'Spring Boot', 'MyBatis-Plus', 'Dubbo', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
      },
      {
        area: '前端与可视化',
        desc: '复杂交互界面的实现，包括 3D 数据可视化、筛选器密集的仪表盘。',
        chips: ['TypeScript', 'React', 'Three.js', 'Vite', 'Umi'],
      },
      {
        area: '工程与交付',
        desc: '容器化、自动化部署、测试覆盖与可观测性；习惯先把边界和降级策略想清楚。',
        chips: ['Docker', 'nginx', 'GitHub Actions', 'Vercel', 'pytest'],
      },
    ],

    about: {
      title: '关于我',
      lede: '六年全栈，从服务端一路做到界面和模型。',
      backHome: '← 回到首页',
    },


    contact: {
      intro: '有合适的机会、合作，或者只是想聊聊 AI 工程，都欢迎写信给我。',
      emailLabel: '邮箱',
      githubLabel: 'GitHub',
      blogLabel: '博客',
    },

    footer: {
      builtWith: '使用 Astro 构建，托管在 GitHub Pages',
      rights: '保留所有权利',
      backTop: '回到顶部',
    },

    notFound: {
      title: '页面走失了',
      lede: '这个地址没有对应的内容。可能是链接过期，或者我搬家时漏掉了什么。',
      home: '回到首页',
      archive: '翻翻旧博客',
    },
  },

  en: {
    htmlLang: 'en',
    meta: {
      title: 'Archibald (大梁) — Full-stack / AI-native engineer',
      description:
        'Archibald (大梁), a full-stack engineer of six years, now focused on AI-native work: model-release tracking, agent tooling, RAG and data pipelines.',
    },
    nav: { work: 'Work', about: 'About', writing: 'Writing', contact: 'Contact' },
    themeToggle: 'Toggle light/dark theme',
    langSwitch: '切换到中文',
    langSwitchLabel: '中文',
    skipToContent: 'Skip to main content',

    hero: {
      h1: 'Archibald',
      latin: '大梁',
      role: 'Full-stack engineer · ',
      roleStrong: 'AI-native',
      roleTail: ' · 6 yrs',
      lede: [
        'I build backends and frontends, and these days I spend most of my time making LLMs actually finish the job.',
        "Six years end to end: Java/Spring services, PostgreSQL and data pipelines, React/TypeScript interfaces. The past two years have gone AI-native — tracking model releases, agent tooling, RAG, and turning \u201cAI can do the work\u201d into something that ships.",
      ],
      slogan: 'The Roche-limit era of technology',
      sloganEn: '技术的洛希极限时代',
      ctaWork: 'See the work',
      ctaMail: 'Email me',
    },

    sections: {
      work: 'Selected work',
      workNote: 'open source',
      minor: 'Other projects',
      ability: 'What I do',
      writing: 'Writing',
      writingNote: 'all posts',
      contact: 'Contact',
    },

    blog: {
      title: 'Blog',
      lede: 'Notes on engineering trade-offs, things I broke along the way, and ideas I have not fully worked out yet.',
      latest: 'Latest posts',
      allPosts: 'All posts',
      byYear: 'By year',
      tagsTitle: 'Tags',
      tagPageTitle: 'Tag',
      tagPrefix: 'Tag: ',
      empty: 'No posts yet. The first one is on its way.',
      backToBlog: '← Back to all posts',
      publishedOn: 'Published',
      updatedOn: 'Updated',
      rss: 'RSS feed',
      readMore: 'Read more',
      countUnit: 'posts',
      legacyTitle: 'Earlier archive',
      legacyNote:
        'Notes and posts written on Hexo before August 2025. Nothing was migrated — the links are the original paths.',
      legacyLink: 'Browse the archive',
      adminHint: 'Content admin',
      totalPrefix: '',
      countUnitOne: ' post',
    },

    work: {
      stackLabel: 'Stack',
      repo: 'Source',
      details: 'Detail',
      readMore: 'Read the detail',
      backToWork: '← Back to work',
      role: 'Role',
      period: 'Period',
      viewRepo: 'View source on GitHub',
    },

    ability: [
      {
        area: 'AI-native apps',
        desc: 'LLM application design, cross-validating multiple data sources, agent tooling, RAG and prompt engineering — pushing past “it runs” to “it can ship”.',
        chips: ['LLM', 'DeepSeek', 'RAG', 'Agent', 'Prompting'],
      },
      {
        area: 'Backend & data',
        desc: 'Service APIs, data pipelines and caching layers; the kind of work that means chewing through data, static analysis and lineage graphs.',
        chips: ['Java', 'Spring Boot', 'MyBatis-Plus', 'Dubbo', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
      },
      {
        area: 'Frontend & visualization',
        desc: 'Building interfaces with real complexity, including 3D data visualization and filter-heavy dashboards.',
        chips: ['TypeScript', 'React', 'Three.js', 'Vite', 'Umi'],
      },
      {
        area: 'Engineering & delivery',
        desc: 'Containers, automated deploys, test coverage and observability; I like to know the boundaries and the degradation path before writing the happy path.',
        chips: ['Docker', 'nginx', 'GitHub Actions', 'Vercel', 'pytest'],
      },
    ],

    about: {
      title: 'About',
      lede: 'Six years full-stack, from the server side all the way up to interfaces and models.',
      backHome: '← Back home',
    },


    contact: {
      intro: 'Good roles, collaborations, or just a conversation about AI engineering — email is the fastest way.',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      blogLabel: 'Blog',
    },

    footer: {
      builtWith: 'Built with Astro, hosted on GitHub Pages',
      rights: 'All rights reserved',
      backTop: 'Back to top',
    },

    notFound: {
      title: 'Page not found',
      lede: 'There is nothing at this address. The link may be stale, or something got lost when I moved.',
      home: 'Back home',
      archive: 'Browse the old blog',
    },
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}

/** 按语言取首页/关于页路径 */
export function pathFor(lang: Lang, page: 'home' | 'about' = 'home') {
  const prefix = lang === 'zh' ? '' : '/en';
  return page === 'home' ? `${prefix}/` : `${prefix}/about/`;
}

/** 作品详情页路径 */
export function workPath(lang: Lang, slug: string) {
  const prefix = lang === 'zh' ? '' : '/en';
  return `${prefix}/work/${slug}/`;
}

/** 博客列表页路径 */
export function blogPath(lang: Lang) {
  const prefix = lang === 'zh' ? '' : '/en';
  return `${prefix}/blog/`;
}

/** 文章详情页路径 */
export function postPath(lang: Lang, slug: string) {
  return `${blogPath(lang)}${slug}/`;
}

/** 标签页路径。标签里可能有空格和大写，统一编码 */
export function tagPath(lang: Lang, tag: string) {
  return `${blogPath(lang)}tag/${encodeURIComponent(tag)}/`;
}

/** RSS 路径 */
export function rssPath(lang: Lang) {
  return lang === 'zh' ? '/rss.xml' : '/en/rss.xml';
}

/** 日期格式化：中文用「2026 年 10 月 14 日」，英文用「Oct 14, 2026」 */
export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

