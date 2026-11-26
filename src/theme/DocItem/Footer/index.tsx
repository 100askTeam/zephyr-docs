import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import GiscusComment from '@site/src/components/GiscusComment';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const {frontMatter} = useDoc();
  const isPortalLanding = Boolean(frontMatter?.hide_table_of_contents);

  return (
    <>
      <Footer {...props} />
      {!isPortalLanding && <GiscusComment />}
    </>
  );
}
