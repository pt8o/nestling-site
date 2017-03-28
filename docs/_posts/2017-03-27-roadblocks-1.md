---
layout: post
title: "Roadblocks, pt. 1"
date: 2017-03-27
image: /nestling-site/img/audio-visualizer.png
author: lucas
---

<h2>OK.</h2>

<p>I've been building the pitch detection script. A few weeks into development, I seemed to have done it, and was really stoked on it -- I even <a href='https://twitter.com/Nestling_Game/status/836382679662792704'>tweeted a video</a> of it being used as a visualizer for a <a href='https://mrcarmack.bandcamp.com/track/fire-no-payroll'>dope trap beat</a>.</p>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Our game uses a custom pitch detection script... Which can also make a sick audio visualizer <a href="https://twitter.com/hashtag/unity3d?src=hash">#unity3d</a> <a href="https://twitter.com/hashtag/gamedev?src=hash">#gamedev</a><br><br>-L <a href="https://t.co/fJEVnbEhZh">pic.twitter.com/fJEVnbEhZh</a></p>&mdash; Nestling (@Nestling_Game) <a href="https://twitter.com/Nestling_Game/status/836382679662792704">February 28, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<h2>But all was not well in wonderland.</h2>

<p>Hey, musician types: notice how nothing in the higher end of the spectrum gets very high in volume? It seems like all of the volume is in the low end. I chalked this up to dope trap beats being really bass-heavy. <b>I was wrong</b>.</p>

<h2>Let's back up. How does the script work?</h2>
<p>The script takes an audio source and, using Unity's built in GetSpectrumData function, cuts up the audio into its component frequencies, and then...</p>

<h2>No back up even more. How does <i>sound</i> work?</h2>
<p>Oh, OK!</p>

<div id='logarithmic' style='display:none;'></div>

<p>Sound is literally airwaves. (Or water waves, if you're underwater. Or, like, oil waves, if you're submerged in a vat of oil for some reason?) That's all it is! Waves propagate at various <b>frequencies</b> (measured in Hertz of Hz); as in, they oscillate a certain number of times per second. We animal creatures interpret these frequencies as <b>pitch</b>; higher pitched sounds correspond to waves oscillating at a higher frequency. Here's the catch: our hearing is logarithmic. What sounds like a linear increase in pitch is actually an <i>exponential</i> increase in frequency.</p>

<p>Hold on to that idea; we'll come back to it later.</p>

<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Sine_waves_different_frequencies.svg/2250px-Sine_waves_different_frequencies.svg.png'/>

<p>In addition to frequency, waves have an <b>amplitude</b>, meaning how big they are, meaning how loud they are, meaning <b>volume</b>.</p>

<p>The above picture shows a very basic sine wave. Real life sound is usually much more complex than that, but what's really mind-blowing is that any sound can be broken down into a combination of various frequencies at various amplitudes. Which means, with a good synthesizer and a lot of multi-track recording and an unreasonable amount of time, you could <i>theoretically</i> recreate any sound.</p>

<p>That part isn't interesting though. What's interesting is this:</p>

<img src='https://upload.wikimedia.org/wikipedia/commons/4/4c/Square1000_spectrum.png'/>

<p>This is an audio spectrum graph showing the amplitudes (across the spectrum of frequencies) of an audio sample at a given point in time.</p>

<h2>Alright. Back to the script.</h2>
<p>Unity's GetSpectrumData function cuts up an audio source into its component frequencies... sort of. What it specifically does is it cuts up the audio into any number of frequency slices, where each of these slices represents a <i>range</i> of frequencies, and the number of slices has to be a power of 2 (up to a maximum of 8192). A larger number of slices means each slice covers a smaller range of frequencies, meaning it's more accurate. It outputs an array, where each element of the array is the amplitude of that particular slice, at the time that the function was called.</p>

<p>I know this is getting confusing. Here's an example: for <i>Nestling</i>, we're using 2048 as our number of slices. Our audio is being piped in at a standard 44.1kHz, which means 22.05kHz per channel (left and right), which means each "slice" in our array represents a span of 22050 Hz / 2048 slices = ~10.766 Hz per slice. </p>

<p>My initial script, which I was so stoked on that I tweeted a video of it, very simply mapped each slice to its "true" frequency, and then mapped each of those frequencies to its corresponding pitch in the western music scale -- you know, G, B flat, F sharp, that stuff. It then built a sort of dynamic bar graph based on those frequencies, and <i>voilà</i>.</p>

<h2>So... what's with the decreasing volume in higher pitches?</h2>

<p>Here's where things get weird. Remember how I said our perception of a linear increase in pitch corresponds physically to an exponential increase in frequency? No? <a href='#logarithmic'>It's here, go back and read it.</a></p>

<p>Each slice in our array is about 10Hz "wide," but as you increase in pitch, each pitch is <b>a greater number of Hz away from the previous</b>.</p>

<p>As an example, middle C (or C4) is located at 261.63Hz, and the D above it (D4) is located at 293.66Hz, a difference of about 30Hz. Two octaves up, C6 is located at 1046.5Hz, and D6 is located at 1174.66, a difference of about 130Hz!</p>

<p>Do you see the problem? <b>Higher notes or pitches actually physically cover a wider range of frequencies each</b>, compared to lower notes! My initial script didn't take this into account.</p>

<p>I rewrote the script and it works beautifully now. But it was two full weeks late, which is a big deal in a 15-week development cycle.</p>

<h2>There are a couple of lessons here.</h2>
<p>The first is that Unity has very little documentation on its audio processing functionality. It has some powerful tools, but it took a lot of <a href='https://duckduckgo.com'>DuckDuckGo</a>ing and a lot of trial-and-error to figure out that, for example, GetAudioSpectrum sliced up the audio source according to its audio sampling rate. Audio wizards, beware.</p>

<p>The second is that <b>new tools take time to build</b>. I knew the theory behind how to build this pitch detection script since the beginning of development, but getting familiar with exactly how Unity handles audio spectrum data was about a week on its own, and then implementing my ideas into Unity was another week. There were so many failed iterations that it was worth my time to <a href='https://docs.google.com/spreadsheets/d/1_5y5PHcWEorZX10GDdnKLC4XBsPvsO6shfln-wiCwXQ/edit?usp=sharing'>make a spreadsheet</a> to handle the frequency conversions, and a <a href='https://suprko.github.io/csharp_text-to-array-parser/'>JavaScript tool</a> to parse columns of pasted spreadsheet data into CSharp arrays!</p>

<p>Lesson learned: account for unknowns. Estimate the time commitment as best you can... and then double your estimate.</p>

<p>See you nest time.</p>
