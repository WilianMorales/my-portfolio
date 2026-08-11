import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';

const SITE_URL = 'https://wilianmorales.github.io/my-portfolio';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/portfolio/portfolio.webp`;
const JSON_LD_ID = 'seo-jsonld-page';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  init(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null)
      )
      .subscribe(() => this.updateSeo());

    this.translate.onLangChange.subscribe(() => this.updateSeo());
  }

  private updateSeo(): void {
    const seoKey = this.getSeoKey(this.router.routerState.snapshot.root);
    const lang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
    const pageUrl = `${SITE_URL}${this.router.url}`.replace(/\/$/, '');

    this.document.documentElement.lang = lang;

    const translatedTitle = this.translate.instant(`seo.${seoKey}.title`);
    const translatedDescription = this.translate.instant(`seo.${seoKey}.description`);

    this.title.setTitle(translatedTitle);
    this.meta.updateTag({ name: 'description', content: translatedDescription });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Wilian Morales Portfolio' });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'es' ? 'es_ES' : 'en_US' });
    this.meta.updateTag({ property: 'og:title', content: translatedTitle });
    this.meta.updateTag({ property: 'og:description', content: translatedDescription });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_OG_IMAGE });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:url', content: pageUrl });
    this.meta.updateTag({ name: 'twitter:title', content: translatedTitle });
    this.meta.updateTag({ name: 'twitter:description', content: translatedDescription });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_OG_IMAGE });

    const canonical = this.document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    }

    this.updateJsonLd(seoKey, translatedTitle, translatedDescription, pageUrl);
  }

  private updateJsonLd(seoKey: string, title: string, description: string, pageUrl: string): void {
    const existing = this.document.getElementById(JSON_LD_ID);
    existing?.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = JSON_LD_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageUrl,
      url: pageUrl,
      name: title,
      description,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Wilian Morales | Portfolio',
        url: SITE_URL
      },
      about:
        seoKey === 'home'
          ? {
              '@type': 'Person',
              url: SITE_URL,
              name: 'Wilian Morales',
              jobTitle: 'Frontend & Web Developer'
            }
          : undefined
    });
    this.document.head.appendChild(script);
  }

  private getSeoKey(snapshot: ActivatedRouteSnapshot): string {
    let route = snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data['seo'] ?? 'home';
  }
}
