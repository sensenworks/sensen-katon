import { IKatonElement } from "./declarations";
import KatonElement from "./elements";
import { KatonEmitter } from "./emitter";



export class KatonElementHeadling extends KatonElement implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}

export class KatonElementHeadlingBigger extends KatonElementHeadling implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}

export class KatonElementHeadlingBig extends KatonElementHeadling implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}

export class KatonElementHeadlingMedium extends KatonElementHeadling implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}

export class KatonElementHeadlingSmall extends KatonElementHeadling implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}

export class KatonElementHeadlingSmaller extends KatonElementHeadling implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
}
