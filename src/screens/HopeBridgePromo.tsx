import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Press, T, useCardShadow } from '../components/UI';
import { usePalette } from '../theme';
import { HOPE_BRIDGE_APPS, HOPE_BRIDGE_EMAIL, HOPE_BRIDGE_MISSION, HOPE_BRIDGE_PILLARS, HOPE_BRIDGE_URL, HOPE_BRIDGE_ANGEL_TALK_URL, BLOOM_FEATURES, BLOOM_VIDEO_STEPS } from '../data/hopeBridge';

export default function HopeBridgePromo({ view = 'portfolio' }: { view?: 'portfolio' | 'bloom' }) {
  const p = usePalette();
  const shadow = useCardShadow();
  const card = { backgroundColor: p.card, borderRadius: 22, padding: 18, marginBottom: 14 } as const;
  const openLink = (url: string) => { Linking.openURL(url).catch(() => {}); };

  if (view === 'bloom') {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <View style={[{ borderRadius: 28, overflow: 'hidden', marginTop: 12, marginBottom: 18 }, shadow]}>
          <View style={{ backgroundColor: '#4B57D6', padding: 22 }}>
            <T size={42} style={{ lineHeight: 48, textAlign: 'center' }}>🌱</T>
            <T w={800} size={28} color="#fff" style={{ textAlign: 'center', marginTop: 6 }}>BloomLearn</T>
            <T w={700} size={14} color="#D9D6F5" style={{ textAlign: 'center', marginTop: 4, lineHeight: 20 }}>Say it. See it. Learn it.</T>
          </View>
          <View style={{ backgroundColor: p.card, padding: 18 }}>
            <T w={800} size={17} style={{ marginBottom: 8 }}>AI-powered visual learning</T>
            <T w={600} size={15} color={p.muted} style={{ lineHeight: 23 }}>
              BloomLearn turns spoken or typed sentences into visual learning scenes, helping children understand language, maths and science in a more natural and memorable way.
            </T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {['English', 'Maths', 'Science', 'Visual learning', 'Video lessons'].map((tag) => (
                <View key={tag} style={{ backgroundColor: p.violetSoft, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 }}>
                  <T w={700} size={12} color={p.ink}>{tag}</T>
                </View>
              ))}
            </View>
            <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ marginTop: 16, backgroundColor: '#4B57D6', borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={16} color="#fff">Visit BloomLearn</T>
            </Press>
          </View>
        </View>

        <View style={[card, shadow]}>
          <T w={800} size={18} style={{ marginBottom: 10 }}>How it works</T>
          <View style={{ gap: 10 }}>
            {[
              { title: '1. Tap a picture', desc: 'Choose a sentence, word or idea to learn.' },
              { title: '2. Build a scene', desc: 'The app turns words into clear visual scenes.' },
              { title: '3. Learn with videos', desc: 'Watch step-by-step explanations and practice tasks.' },
            ].map((step) => (
              <View key={step.title} style={{ backgroundColor: p.bg, borderRadius: 14, padding: 12 }}>
                <T w={800} size={14}>{step.title}</T>
                <T w={600} size={12.5} color={p.muted} style={{ marginTop: 4, lineHeight: 18 }}>{step.desc}</T>
              </View>
            ))}
          </View>
        </View>

        <View style={[card, shadow]}>
          <T w={800} size={18} style={{ marginBottom: 10 }}>Why it helps</T>
          <View style={{ gap: 10 }}>
            {BLOOM_FEATURES.map((f) => (
              <View key={f.title} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <T size={22}>{f.ico}</T>
                <View style={{ flex: 1 }}>
                  <T w={800} size={14}>{f.title}</T>
                  <T w={600} size={12.5} color={p.muted} style={{ lineHeight: 18 }}>{f.desc}</T>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[card, shadow]}>
          <T w={800} size={18} style={{ marginBottom: 10 }}>BloomLearn video workflow</T>
          {BLOOM_VIDEO_STEPS.map((step) => (
            <View key={step.num} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#4D96FF', alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={14} color="#fff">{step.num}</T>
              </View>
              <View style={{ flex: 1 }}>
                <T w={800} size={14}>{step.title}</T>
                <T w={600} size={12.5} color={p.muted} style={{ lineHeight: 18 }}>{step.desc}</T>
              </View>
            </View>
          ))}
        </View>

        <View style={[card, shadow]}>
          <T w={800} size={18} style={{ marginBottom: 8 }}>Made for</T>
          <T w={600} size={13.5} color={p.muted} style={{ lineHeight: 21 }}>
            Children in Grades 1–5, families, therapists and teachers who want speech, language, maths and science learning to feel visual, calm and easy to understand.
          </T>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
      <View style={[{ borderRadius: 28, overflow: 'hidden', marginTop: 12, marginBottom: 18 }, shadow]}>
        <View style={{ backgroundColor: '#EEEAFE', padding: 20 }}>
          <T size={38} style={{ lineHeight: 44, textAlign: 'center' }}>🌉</T>
          <T w={800} size={27} color="#34316A" style={{ textAlign: 'center', marginTop: 6 }}>Hope Bridge Digital</T>
          <T w={700} size={14} color="#6862A1" style={{ textAlign: 'center', marginTop: 4, lineHeight: 20 }}>Calm, family-first apps for learning and communication</T>
        </View>
        <View style={{ backgroundColor: '#FFFDF8', padding: 18 }}>
          <T w={600} size={15} color={p.ink} style={{ lineHeight: 23 }}>
            {HOPE_BRIDGE_MISSION}
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {HOPE_BRIDGE_PILLARS.map((pillar) => (
              <View key={pillar} style={{ backgroundColor: p.violetSoft, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 }}>
                <T w={700} size={12} color={p.ink}>{pillar}</T>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ flex: 1, backgroundColor: '#FFCF68', borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={16} color="#34316A">🌐 Visit live site</T>
            </Press>
            <Press onPress={() => Linking.openURL(`mailto:${HOPE_BRIDGE_EMAIL}`)} style={{ flex: 1, backgroundColor: p.sky, borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={16} color={p.ink}>✉️ Email</T>
            </Press>
          </View>
        </View>
      </View>

      <View style={[{ backgroundColor: '#FFFDF8', borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#EEE8D8' }, shadow]}>
        <T w={800} size={18} style={{ marginBottom: 8 }}>Empowering every child’s unique voice</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21, marginBottom: 14 }}>
          Discover calm, family-friendly learning and communication apps.
        </T>
        <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ backgroundColor: '#FFCF68', borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <T w={800} size={16} color="#34316A">🌐 Visit hopebridgedigital.site</T>
        </Press>
        <Press onPress={() => Linking.openURL(`mailto:${HOPE_BRIDGE_EMAIL}`)} style={{ backgroundColor: '#EEEAFE', borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D8D2F7' }}>
          <T w={800} size={16} color="#34316A">✉️ Contact the publisher</T>
        </Press>
      </View>

      {false && (
      <>
      <View style={[card, shadow]}>
        <T w={800} size={18} style={{ marginBottom: 8 }}>Portfolio overview</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          Hope Bridge Digital creates calm, evidence-informed tools for children and families. The portfolio focuses on dedicated apps for communication, learning, attention, and care coordination rather than broad game hubs or general-purpose utility screens.
        </T>
      </View>

      <T w={800} size={18} style={{ marginBottom: 12 }}>Our dedicated apps</T>
      <View style={{ gap: 12 }}>
        {HOPE_BRIDGE_APPS.map((app) => (
          <View key={app.name} style={[card, shadow]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: `${app.color}22`, borderWidth: 2, borderColor: app.color, alignItems: 'center', justifyContent: 'center' }}>
                <T size={26}>{app.ico}</T>
              </View>
              <View style={{ flex: 1 }}>
                <T w={800} size={18}>{app.name}</T>
                <T w={700} size={12.5} color={app.color}>{app.tagline}</T>
              </View>
            </View>
            <T w={700} size={12.5} color={app.color} style={{ marginBottom: 6 }}>{app.category}</T>
            <T w={600} size={14} color={p.muted} style={{ lineHeight: 21, marginBottom: 6 }}>{app.description}</T>
            <T w={700} size={13} color={p.ink} style={{ marginBottom: 8 }}>Best for: {app.audience}</T>
            <View style={{ gap: 6, marginBottom: 10 }}>
              {app.details.map((detail) => (
                <View key={detail} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <T size={16}>•</T>
                  <T w={600} size={12.5} color={p.muted} style={{ flex: 1, lineHeight: 18 }}>{detail}</T>
                </View>
              ))}
            </View>
            {app.name === 'Angel Talk' ? (
              <Press onPress={() => openLink(HOPE_BRIDGE_ANGEL_TALK_URL)} style={{ backgroundColor: p.sky, borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={13.5}>Open Angel Talk</T>
              </Press>
            ) : app.name === 'Angel Artic' ? (
              <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ backgroundColor: p.violetSoft, borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={13.5}>Explore Angel Artic</T>
              </Press>
            ) : app.name === 'BloomLearn' ? (
              <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ backgroundColor: '#E8F5E9', borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={13.5} color="#1B5E20">View BloomLearn</T>
              </Press>
            ) : app.name === 'Bloom Focus' ? (
              <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ backgroundColor: '#FFF3E0', borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={13.5} color="#B86B00">View Bloom Focus</T>
              </Press>
            ) : app.name === 'Nexia Bridge' ? (
              <Press onPress={() => openLink(HOPE_BRIDGE_URL)} style={{ backgroundColor: '#FDE7F1', borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={13.5} color="#A42869">View Nexia Bridge</T>
              </Press>
            ) : null}
          </View>
        ))}
      </View>

      <View style={[card, shadow, { marginTop: 10 }]}>
        <T w={800} size={18} style={{ marginBottom: 10 }}>BloomLearn features</T>
        <View style={{ gap: 10 }}>
          {BLOOM_FEATURES.map((f) => (
            <View key={f.title} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <T size={22}>{f.ico}</T>
              <View style={{ flex: 1 }}>
                <T w={800} size={14}>{f.title}</T>
                <T w={600} size={12.5} color={p.muted} style={{ lineHeight: 18 }}>{f.desc}</T>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[card, shadow]}>
        <T w={800} size={18} style={{ marginBottom: 10 }}>BloomLearn video workflow</T>
        {BLOOM_VIDEO_STEPS.map((step) => (
          <View key={step.num} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#4D96FF', alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={14} color="#fff">{step.num}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T w={800} size={14}>{step.title}</T>
              <T w={600} size={12.5} color={p.muted} style={{ lineHeight: 18 }}>{step.desc}</T>
            </View>
          </View>
        ))}
      </View>

      <View style={[card, shadow]}>
        <T w={800} size={18} style={{ marginBottom: 8 }}>Safety & privacy</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          Zero ad networks, on-device storage, no sales tracking, and parent-gated access for sensitive settings and outbound links.
        </T>
      </View>

      <View style={[card, shadow]}>
        <T w={800} size={18} style={{ marginBottom: 8 }}>Contact</T>
        <Press onPress={() => Linking.openURL(`mailto:${HOPE_BRIDGE_EMAIL}`)}>
          <T w={700} size={14} color={p.ink}>{HOPE_BRIDGE_EMAIL}</T>
        </Press>
      </View>
      </>
      )}
    </ScrollView>
  );
}
