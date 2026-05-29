/** GitHub 저장소 · Pages URL (배포 시 VITE_* 로 덮어쓸 수 있음) */
export const siteConfig = {
  githubRepo:
    import.meta.env.VITE_GITHUB_REPO ?? "https://github.com/hjroh75/Learning_App",
  githubPages:
    import.meta.env.VITE_SITE_URL ?? "https://hjroh75.github.io/Learning_App/",
};
