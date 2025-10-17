-- 视频AI公司融资信息数据
-- 包含各公司的融资轮次、投资方和估值信息

-- 插入Google DeepMind的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Acquisition', 500000000, ARRAY['Google'], '2014-01-01'
FROM public.companies c WHERE c.name = 'Google DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Google'], '2013-06-01'
FROM public.companies c WHERE c.name = 'Google DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Google'], '2012-03-01'
FROM public.companies c WHERE c.name = 'Google DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Google'], '2011-06-01'
FROM public.companies c WHERE c.name = 'Google DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['Google'], '2010-03-01'
FROM public.companies c WHERE c.name = 'Google DeepMind';

-- 插入Artlist的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Artlist';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Artlist';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Artlist';

-- 插入Stability AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2022-10-01'
FROM public.companies c WHERE c.name = 'Stability AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Stability AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Stability AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Stability AI';

-- 插入Runway的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 300000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Runway';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Runway';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Runway';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Runway';

-- 插入Pika Labs的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'Pika Labs';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Pika Labs';

-- 插入Luma AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2023-03-01'
FROM public.companies c WHERE c.name = 'Luma AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Luma AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Luma AI';

-- 插入Synthesia的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Synthesia';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Synthesia';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Synthesia';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Synthesia';

-- 插入海螺AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = '海螺AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = '海螺AI';

-- 插入SeaArt的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 40000000, ARRAY['SoftBank', 'Alibaba'], '2024-02-01'
FROM public.companies c WHERE c.name = 'SeaArt';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 15000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'SeaArt';

-- 插入Vidu的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 30000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'Vidu';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Vidu';

-- 插入SeedDream的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 80000000, ARRAY['SoftBank', 'Alibaba'], '2024-03-01'
FROM public.companies c WHERE c.name = 'SeedDream';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 30000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'SeedDream';

-- 插入Viddo AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2024-02-01'
FROM public.companies c WHERE c.name = 'Viddo AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Viddo AI';

-- 插入Wan AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 40000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'Wan AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 15000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Wan AI';

-- 插入Kling AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 30000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'Kling AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Kling AI';

-- 插入Dreamina的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2024-02-01'
FROM public.companies c WHERE c.name = 'Dreamina';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Dreamina';

-- 插入PixVerse的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 30000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'PixVerse';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'PixVerse';

-- 插入LeiaPix的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 40000000, ARRAY['SoftBank', 'Alibaba'], '2024-01-01'
FROM public.companies c WHERE c.name = 'LeiaPix';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 15000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'LeiaPix';
