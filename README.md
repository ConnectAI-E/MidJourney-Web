<p align='center'>
 <strong>MidJourney-Web</strong>
<br>
</p>



<p align='center'>
 🍎 Supercharged Experience For  MidJourney On Web UI
<br>
</p>





<p align='center'>
  🚧正在施工~预计2023年06月19日发布  
</p>

<div align="center">
	<a href='https://www.connectai-e.com' target="_blank" rel="noopener noreferrer">
	<img width="800" alt="image" src="https://github-production-user-asset-6210df.s3.amazonaws.com/50035229/246644404-d8b30cab-ebae-42dd-8306-4e9904a18b65.png">
	</a>
</div>

## Feature List
- support `/imagine` 

## Quick Start

### Midjourney-Api
```bash
docker run -d --name midjourney-proxy \
 -p 8080:8080 \
 -e mj.discord.guild-id=xxx \
 -e mj.discord.channel-id=xxx \
 -e mj.discord.user-token=xxx \
 --restart=always \
 novicezk/midjourney-proxy:2.2.3
```
more config info [MidJourney-Api](https://github.com/novicezk/midjourney-proxy/blob/main/docs/discord-params.md)

check swagger document: http://localhost:8080/mj

### Midjourney-Web
```bash
mv .env.example .env
pnpm install
pnpm run dev
```

## Technology Stack
- [react](https://react.dev/)
- [vite](https://vitejs.dev/)
- [unocss](https://github.com/unocss/unocss)
- [jotai](https://jotai.org/)
- [react query](https://tanstack.com/query/v3/)



